import { Renderer, Program, Triangle, Mesh, Texture, Vec2 } from 'ogl';
import { vertex, fragment } from './shaders';
import type { Crop, SceneSpec } from './scene';

export interface GraphicsDiagnostics {
  mode: string;
  frames: number;
  active: boolean;
  quality: number;
  width: number;
  height: number;
  renderMs: number;
  reason?: string;
}

/** Um passe, uma textura. O estado óptico depende somente do progresso da rolagem. */
export class ContinuityRenderer {
  private renderer: Renderer;
  private program?: Program;
  private geometry?: Triangle;
  private mesh?: Mesh;
  private texture?: Texture;
  private source?: HTMLImageElement;
  private spec?: SceneSpec;
  private request=0;
  private lost=false;
  private disposed=false;
  private visible=true;
  private lastState='';
  private sampleCount=0;
  private cost=0;
  private slow=0;
  private logicalWidth=1;
  private logicalHeight=1;
  private webglVersion:1|2=1;
  private state={ crop:{ x:0,y:0,width:1,height:1 }, progress:0 };
  readonly diagnostics: GraphicsDiagnostics={mode:'loading',frames:0,active:false,quality:1,width:0,height:0,renderMs:0};

  constructor(private holder: HTMLElement, private onFailure:(reason:string)=>void, private debug=false, lowQuality=false) {
    const canvas=document.createElement('canvas');
    const options={alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power' as const};
    if(canvas.getContext('webgl2',options))this.webglVersion=2;
    else if(!canvas.getContext('webgl',options))throw new Error('WebGL indisponível.');
    this.renderer=new Renderer({canvas,webgl:this.webglVersion,...options});
    canvas.setAttribute('aria-hidden','true');
    canvas.addEventListener('webglcontextlost',this.onLost);
    canvas.addEventListener('webglcontextrestored',this.onRestored);
    this.holder.append(canvas);
    this.diagnostics.quality=lowQuality?.6:1;
    document.addEventListener('visibilitychange',this.onVisibility);
  }

  async load(url:string,spec:SceneSpec) {
    this.holder.classList.remove('is-ready');
    this.diagnostics.mode='loading';
    const source=new Image(); source.src=url;
    let timeout:ReturnType<typeof setTimeout>|undefined;
    try {
      await Promise.race([source.decode(),new Promise<never>((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Tempo de carregamento da textura excedido.')),8000);})]);
    } finally {clearTimeout(timeout);}
    if(this.disposed) return;
    this.source=source; this.spec=spec;
    if(this.lost) return;
    this.release(); this.build(); this.lastState='';
    this.diagnostics.mode='webgl'; this.draw();
    this.holder.classList.add('is-ready');
  }

  resize(width:number,height:number) {
    this.logicalWidth=Math.max(1,width);this.logicalHeight=Math.max(1,height);
    if(this.disposed||this.lost)return;
    const cap=matchMedia('(pointer:coarse)').matches?1.25:1.5;
    this.renderer.dpr=Math.min(devicePixelRatio||1,cap,Math.sqrt(2_000_000/(width*height)))*this.diagnostics.quality;
    this.renderer.setSize(this.logicalWidth,this.logicalHeight);
    const canvas=this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.style.width='100%';canvas.style.height='100%';
    this.diagnostics.width=canvas.width;this.diagnostics.height=canvas.height;
    this.lastState='';this.schedule();
  }

  update(crop:Crop,progress:number) {
    this.state={crop,progress};
    const key=[crop.x,crop.y,crop.width,crop.height,progress].map(n=>n.toFixed(6)).join(',');
    if(key===this.lastState)return;
    this.lastState=key;this.schedule();
  }
  setVisible(visible:boolean) {this.visible=visible;if(visible)this.schedule();else this.pause();}
  private schedule() {
    if(!this.request&&!this.disposed&&!this.lost&&this.visible&&!document.hidden&&this.mesh){this.diagnostics.active=true;this.request=requestAnimationFrame(this.draw);}
  }
  private build() {
    if(!this.source||!this.spec)return;
    const gl=this.renderer.gl;
    this.texture=new Texture(gl,{image:this.source,generateMipmaps:false,minFilter:gl.LINEAR,magFilter:gl.LINEAR,wrapS:gl.CLAMP_TO_EDGE,wrapT:gl.CLAMP_TO_EDGE});
    // OGL também tenta configurar WRAP_R em texturas 2D; esse enum não existe no WebGL 1.
    if(!this.renderer.isWebgl2)Object.assign(this.texture.state,{wrapR:this.texture.wrapR});
    this.program=new Program(gl,{vertex,fragment,transparent:true,depthTest:false,depthWrite:false,cullFace:false,uniforms:{
      tScene:{value:this.texture},uCrop:{value:[0,0,1,1]},uWater:{value:this.spec.water},
      uImageSize:{value:new Vec2(this.spec.width,this.spec.height)},uProgress:{value:0},uDebug:{value:this.debug?1:0},
    }});
    if(!gl.getProgramParameter(this.program.program,gl.LINK_STATUS))throw new Error('Falha ao compilar a refração.');
    this.geometry=new Triangle(gl);this.mesh=new Mesh(gl,{geometry:this.geometry,program:this.program});
  }
  private draw=()=>{
    this.request=0;this.diagnostics.active=false;
    if(this.disposed||this.lost||!this.visible||document.hidden||!this.mesh||!this.program)return;
    const start=performance.now();const {crop,progress}=this.state;
    this.program.uniforms.uCrop.value=[crop.x,crop.y,crop.width,crop.height];
    this.program.uniforms.uProgress.value=progress;
    this.renderer.render({scene:this.mesh});
    const elapsed=performance.now()-start;
    this.cost+=elapsed;this.sampleCount++;this.diagnostics.frames++;
    this.diagnostics.renderMs=this.cost/this.sampleCount;
    this.slow=elapsed>18?this.slow+1:Math.max(0,this.slow-1);
    if(this.slow>24){
      if(this.diagnostics.quality>.6){this.diagnostics.quality*=.75;this.slow=0;this.resize(this.logicalWidth,this.logicalHeight);}
      else this.fail('Custo gráfico persistente acima do limite.');
    }
  };
  pause(){cancelAnimationFrame(this.request);this.request=0;this.diagnostics.active=false;}
  private onVisibility=()=>{if(document.hidden)this.pause();else this.schedule();};
  private onLost=(event:Event)=>{event.preventDefault();this.lost=true;this.pause();this.holder.classList.remove('is-ready');this.diagnostics.mode='context-lost';};
  private onRestored=()=>{
    if(this.disposed)return;
    try{
      const canvas=this.renderer.gl.canvas as HTMLCanvasElement;
      this.renderer=new Renderer({canvas,webgl:this.webglVersion,alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power'});
      this.lost=false;this.build();this.resize(this.logicalWidth,this.logicalHeight);
      this.diagnostics.mode='webgl';this.draw();this.holder.classList.add('is-ready');
    }catch{this.fail('Não foi possível restaurar o contexto gráfico.');}
  };
  private release(){
    if(this.lost)return;
    if(this.texture)this.renderer.gl.deleteTexture(this.texture.texture);
    this.geometry?.remove();this.program?.remove();
    this.texture=undefined;this.geometry=undefined;this.program=undefined;this.mesh=undefined;
  }
  private fail(reason:string){this.dispose();this.onFailure(reason);}
  dispose(){
    if(this.disposed)return;
    this.disposed=true;this.pause();this.release();
    document.removeEventListener('visibilitychange',this.onVisibility);
    const canvas=this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.removeEventListener('webglcontextlost',this.onLost);canvas.removeEventListener('webglcontextrestored',this.onRestored);
    canvas.remove();this.holder.classList.remove('is-ready');this.diagnostics.mode='disposed';
  }
}
