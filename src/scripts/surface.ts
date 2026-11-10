import type {
  SurfaceRenderer,
  SurfaceDiagnostics,
} from "../graphics/SurfaceRenderer";
import type { CalibrationName } from "../graphics/calibrations";

declare global {
  interface Window {
    __lamina?: {
      surface: SurfaceDiagnostics | { mode: string; reason?: string };
      progress: number;
      dispose: () => void;
    };
  }
}

export async function initSurface() {
  const section = document.querySelector<HTMLElement>("[data-surface]");
  if (!section) return;
  const slider = section.querySelector<HTMLInputElement>("#surface-position")!;
  const container = section.querySelector<HTMLElement>(
    "[data-surface-canvas]",
  )!;
  const picture = section.querySelector<HTMLImageElement>(
    "[data-surface-image]",
  )!;
  const controls = section.querySelector<HTMLElement>(
    "[data-surface-controls]",
  )!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const params = new URL(location.href).searchParams;
  const calibration = (
    ["discreta", "moderada", "expressiva"].includes(
      params.get("calibracao") || "",
    )
      ? params.get("calibracao")
      : "moderada"
  ) as CalibrationName;
  let renderer: SurfaceRenderer | undefined;
  let cleanupMotion = () => {};
  let disposed = false;
  let progress = 0;
  let source = "";
  let pointerTime = 0;
  let sectionVisible = true;
  const state = { progress: 0 };
  const fallback = (reason: string) => {
    renderer?.dispose();
    renderer = undefined;
    section.classList.remove("has-webgl");
    window.__lamina!.surface = {
      mode: reduced.matches ? "reduced-motion" : "fallback",
      reason,
    };
  };
  const update = () => {
    progress = state.progress;
    const position = 0.48 + (Number(slider.value) / 100) * 0.28;
    section.style.setProperty("--surface-y", `${position * 100}%`);
    section.style.setProperty("--surface-progress", String(progress));
    section.style.setProperty("--surface-scale", String(1 + 0.035 * progress));
    renderer?.update({ position: 1 - position, progress });
    window.__lamina!.progress = progress;
  };
  controls.hidden = false;
  window.__lamina = {
    surface: { mode: "fallback" },
    progress: 0,
    dispose: () => {
      disposed = true;
      cleanupMotion();
      renderer?.dispose();
      observer.disconnect();
      sourceObserver.disconnect();
      reduced.removeEventListener("change", onPreference);
    },
  };
  slider.addEventListener("input", update);

  async function enhance() {
    if (disposed || reduced.matches || params.get("grafico") === "fallback") {
      fallback(
        reduced.matches
          ? "Preferência por movimento reduzido."
          : "Alternativa visual solicitada.",
      );
      return;
    }
    try {
      const { SurfaceRenderer: Renderer } =
        await import("../graphics/SurfaceRenderer");
      if (disposed || reduced.matches) return;
      renderer?.dispose();
      renderer = new Renderer(container, fallback, calibration);
      renderer.setVisible(sectionVisible);
      window.__lamina!.surface = renderer.diagnostics;
      await renderer.load(picture, "/images/agua-detalhe.webp");
      if (disposed || reduced.matches) {
        renderer?.dispose();
        return;
      }
      source = picture.currentSrc;
      update();
    } catch (error) {
      fallback(
        error instanceof Error
          ? error.message
          : "Renderização gráfica indisponível.",
      );
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      sectionVisible = entries[0].isIntersecting;
      renderer?.setVisible(sectionVisible);
    },
    { threshold: 0 },
  );
  observer.observe(section);
  let resizeTimer: ReturnType<typeof setTimeout>;
  const sourceObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (renderer && source && picture.currentSrc !== source) void enhance();
    }, 200);
  });
  sourceObserver.observe(picture);
  section.addEventListener(
    "pointermove",
    (event) => {
      if (
        event.pointerType !== "mouse" ||
        performance.now() - pointerTime < 60 ||
        !renderer
      )
        return;
      pointerTime = performance.now();
      const bounds = container.getBoundingClientRect();
      renderer.update({
        energy: 1,
        pointer: [
          (event.clientX - bounds.left) / bounds.width,
          1 - (event.clientY - bounds.top) / bounds.height,
        ],
      });
    },
    { passive: true },
  );

  async function motion() {
    cleanupMotion();
    if (reduced.matches) {
      state.progress = 0;
      update();
      return;
    }
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    if (disposed || reduced.matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const animation = gsap.to(state, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      onUpdate: update,
    });
    cleanupMotion = () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }
  function onPreference() {
    if (reduced.matches) fallback("Preferência por movimento reduzido.");
    else void enhance();
    void motion();
  }
  reduced.addEventListener("change", onPreference);
  update();
  // O poster HTML é a apresentação inicial; o efeito é carregado depois de decodificá-lo.
  await picture.decode().catch(() => undefined);
  if (!disposed) {
    await motion();
    void enhance();
  }
  window.addEventListener("pagehide", () => window.__lamina?.dispose(), {
    once: true,
  });
}
