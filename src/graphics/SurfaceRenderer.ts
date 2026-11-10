import { Renderer, Program, Triangle, Mesh, Texture, Vec2 } from "ogl";
import { vertex, fragment } from "./shaders";
import { calibrations, type CalibrationName } from "./calibrations";

export interface SurfaceState {
  position: number;
  progress: number;
  energy: number;
  pointer: [number, number];
}
export interface SurfaceDiagnostics {
  mode: string;
  frames: number;
  active: boolean;
  quality: number;
  renderMs: number;
  calibration: CalibrationName;
  width: number;
  height: number;
}

/** Renderizador independente do conteúdo. Desenha somente enquanto há energia ou estado novo. */
export class SurfaceRenderer {
  private renderer: Renderer;
  private program: Program | null = null;
  private mesh: Mesh | null = null;
  private geometry: Triangle | null = null;
  private textures: Texture[] = [];
  private sources: HTMLImageElement[] = [];
  private frame = 0;
  private observer: ResizeObserver;
  private visible = true;
  private disposed = false;
  private lost = false;
  private state: SurfaceState = {
    position: 0.38,
    progress: 0,
    energy: 0,
    pointer: [0.5, 0.38],
  };
  private previousTime = 0;
  private slowFrames = 0;
  private renderSamples = 0;
  private renderCost = 0;
  private elapsed = 0;
  private energyUntil = 0;
  private logicalWidth = 1;
  private logicalHeight = 1;
  public diagnostics: SurfaceDiagnostics;

  constructor(
    private container: HTMLElement,
    private fallback: (reason: string) => void,
    calibration: CalibrationName = "moderada",
  ) {
    const coarse = matchMedia("(pointer: coarse)").matches;
    this.renderer = new Renderer({
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      dpr: Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5),
      powerPreference: "low-power",
    });
    this.diagnostics = {
      mode: "loading",
      frames: 0,
      active: false,
      quality: 1,
      renderMs: 0,
      calibration,
      width: 0,
      height: 0,
    };
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.addEventListener("webglcontextlost", this.onLost);
    canvas.addEventListener("webglcontextrestored", this.onRestored);
    container.append(canvas);
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(container);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  async load(source: HTMLImageElement, detailUrl: string) {
    const scene = new Image();
    scene.src = source.currentSrc || source.src;
    const detail = new Image();
    detail.src = detailUrl;
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("Tempo de carregamento da textura excedido.")),
        12000,
      );
    });
    try {
      await Promise.race([
        Promise.all([scene.decode(), detail.decode()]),
        timeout,
      ]);
    } finally {
      clearTimeout(timeoutId!);
    }
    if (this.disposed) return;
    this.sources = [scene, detail];
    this.build();
    this.resize();
    this.container.classList.add("is-ready");
    this.container.closest("[data-surface]")?.classList.add("has-webgl");
    this.diagnostics.mode = "webgl";
    this.wake(1100);
  }

  private build() {
    const gl = this.renderer.gl;
    this.textures = this.sources.map(
      (image) =>
        new Texture(gl, {
          image,
          generateMipmaps: false,
          minFilter: gl.LINEAR,
          magFilter: gl.LINEAR,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
        }),
    );
    const calibration = calibrations[this.diagnostics.calibration];
    this.program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        tScene: { value: this.textures[0] },
        tDetail: { value: this.textures[1] },
        uResolution: { value: new Vec2(1, 1) },
        uImageSize: {
          value: new Vec2(
            this.sources[0].naturalWidth,
            this.sources[0].naturalHeight,
          ),
        },
        uDetailSize: {
          value: new Vec2(
            this.sources[1].naturalWidth,
            this.sources[1].naturalHeight,
          ),
        },
        uPointer: { value: new Vec2(0.5, 0.38) },
        uPosition: { value: 0.38 },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uEnergy: { value: 0 },
        uStrength: { value: calibration.strength },
        uWidth: { value: calibration.width },
        uWave: { value: calibration.wave },
        uHighlight: { value: calibration.highlight },
      },
    });
    if (!gl.getProgramParameter(this.program.program, gl.LINK_STATUS))
      throw new Error("Falha ao compilar o shader.");
    this.geometry = new Triangle(gl);
    this.mesh = new Mesh(gl, {
      geometry: this.geometry,
      program: this.program,
    });
  }

  private resize = () => {
    if (this.disposed || this.lost) return;
    const { width, height } = this.container.getBoundingClientRect();
    this.logicalWidth = Math.max(1, width);
    this.logicalHeight = Math.max(1, height);
    const coarse = matchMedia("(pointer: coarse)").matches;
    this.renderer.dpr =
      Math.min(
        devicePixelRatio || 1,
        coarse ? 1.25 : 1.5,
        Math.sqrt(2_000_000 / (this.logicalWidth * this.logicalHeight)),
      ) * this.diagnostics.quality;
    this.renderer.setSize(this.logicalWidth, this.logicalHeight);
    this.diagnostics.width = (
      this.renderer.gl.canvas as HTMLCanvasElement
    ).width;
    this.diagnostics.height = (
      this.renderer.gl.canvas as HTMLCanvasElement
    ).height;
    this.program?.uniforms.uResolution.value.set(
      this.logicalWidth,
      this.logicalHeight,
    );
    this.wake(150);
  };

  update(next: Partial<SurfaceState>) {
    Object.assign(this.state, next);
    this.wake(next.energy ? 800 : 110);
  }

  wake(duration = 700) {
    this.energyUntil = Math.max(this.energyUntil, performance.now() + duration);
    if (
      !this.frame &&
      !this.disposed &&
      !this.lost &&
      this.visible &&
      !document.hidden &&
      this.mesh
    ) {
      this.previousTime = 0;
      this.frame = requestAnimationFrame(this.draw);
    }
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.wake(120);
    else this.pause();
  }

  private draw = (time: number) => {
    this.frame = 0;
    if (
      this.disposed ||
      this.lost ||
      !this.visible ||
      document.hidden ||
      !this.mesh ||
      !this.program
    )
      return;
    const begin = performance.now();
    const remaining = Math.max(0, this.energyUntil - time);
    const energy = Math.min(1, remaining / 700);
    const { uniforms } = this.program;
    this.elapsed += this.previousTime
      ? Math.min(time - this.previousTime, 34) * 0.001
      : 0.016;
    uniforms.uTime.value = this.elapsed;
    uniforms.uPosition.value = this.state.position;
    uniforms.uProgress.value = this.state.progress;
    uniforms.uEnergy.value = energy;
    uniforms.uPointer.value.set(...this.state.pointer);
    this.renderer.render({ scene: this.mesh });
    this.diagnostics.frames++;
    this.renderCost += performance.now() - begin;
    this.renderSamples++;
    this.diagnostics.renderMs = this.renderCost / this.renderSamples;
    if (this.previousTime && time - this.previousTime > 35 && energy > 0.25)
      this.slowFrames++;
    else this.slowFrames = Math.max(0, this.slowFrames - 1);
    this.previousTime = time;
    if (this.slowFrames > 45) {
      if (this.diagnostics.quality > 0.6) {
        this.diagnostics.quality *= 0.75;
        this.slowFrames = 0;
        this.resize();
      } else {
        this.fail("Desempenho gráfico insuficiente.");
        return;
      }
    }
    this.diagnostics.active = remaining > 0;
    if (remaining > 0) this.frame = requestAnimationFrame(this.draw);
  };

  pause() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.diagnostics.active = false;
  }
  private onVisibility = () => {
    if (document.hidden) this.pause();
    else this.wake(120);
  };
  private onLost = (event: Event) => {
    event.preventDefault();
    this.lost = true;
    this.pause();
    this.container.classList.remove("is-ready");
    this.container.closest("[data-surface]")?.classList.remove("has-webgl");
    this.diagnostics.mode = "context-lost";
  };
  private onRestored = () => {
    if (this.disposed) return;
    try {
      this.lost = false;
      // Todas as caches de estado e VAOs pertencem ao contexto anterior.
      const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
      this.renderer = new Renderer({
        canvas,
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        dpr: 1,
        powerPreference: "low-power",
      });
      this.build();
      this.resize();
      this.container.classList.add("is-ready");
      this.container.closest("[data-surface]")?.classList.add("has-webgl");
      this.diagnostics.mode = "webgl";
      this.wake(300);
    } catch {
      this.fail("Não foi possível restaurar o contexto gráfico.");
    }
  };
  private fail(reason: string) {
    this.dispose();
    this.fallback(reason);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.pause();
    this.observer.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    const gl = this.renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.removeEventListener("webglcontextlost", this.onLost);
    canvas.removeEventListener("webglcontextrestored", this.onRestored);
    if (!this.lost) {
      this.textures.forEach((texture) => gl.deleteTexture(texture.texture));
      this.geometry?.remove();
      this.program?.remove();
    }
    this.container.classList.remove("is-ready");
    this.container.closest("[data-surface]")?.classList.remove("has-webgl");
    canvas.remove();
    this.diagnostics.mode = "disposed";
  }
}
