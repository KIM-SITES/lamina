import { horizontal,vertical,pose,clamp,smooth,lerp,type Frame,type Crop,type SceneSpec } from './scene';
import type { ContinuityRenderer,GraphicsDiagnostics } from './ContinuityRenderer';

declare global {
  interface Window {
    __laminaContinuity?: {
      progress:number;frame:Frame;crop:Crop;source:string;motion:string;
      graphics:GraphicsDiagnostics|{mode:string;reason?:string};
      pointerInfluence:false;dispose:()=>void;
    };
  }
}

export async function initContinuity(){
  const element=document.querySelector<HTMLElement>('[data-continuity]');if(!element)return;
  const story:HTMLElement=element;
  const hero=story.querySelector<HTMLElement>('[data-hero]')!;
  const image=story.querySelector<HTMLImageElement>('[data-scene-source]')!;
  const target=story.querySelector<HTMLElement>('[data-destination] picture')!;
  const plane=story.querySelector<HTMLElement>('[data-visual-plane]')!;
  const frameElement=story.querySelector<HTMLElement>('[data-optical-frame]')!;
  const poster=story.querySelector<HTMLImageElement>('[data-plane-poster]')!;
  const holder=story.querySelector<HTMLElement>('[data-continuity-canvas]')!;
  const shade=story.querySelector<HTMLElement>('[data-plane-shade]')!;
  const composition=story.querySelector<HTMLElement>('.hero-composition')!;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const params=new URL(location.href).searchParams;
  let renderer:ContinuityRenderer|undefined;
  let cleanupScroll=()=>{};
  let disposed=false;
  let ready=false;
  let progress=0;
  let source='';
  let spec:SceneSpec=horizontal;
  let base:Frame={x:0,y:0,width:innerWidth,height:hero.offsetHeight};
  let frameRequest=0;
  let sourceGeneration=0;
  let scrollStart=0;
  let scrollDistance=1;
  let cssScale=1;
  const state={progress:0};
  const diagnostics:NonNullable<Window['__laminaContinuity']>={progress:0,frame:base,crop:{x:0,y:0,width:1,height:1},source:'',motion:'static',graphics:{mode:'fallback'},pointerInfluence:false,dispose:()=>dispose()};
  window.__laminaContinuity=diagnostics;

  function fallback(reason:string){renderer?.dispose();renderer=undefined;holder.classList.remove('is-ready');diagnostics.graphics={mode:'fallback',reason};}
  function update(){
    frameRequest=0;if(disposed||!ready||reduced.matches)return;
    progress=clamp(state.progress);
    const rect=target.getBoundingClientRect();
    // Durante a passagem, mira a posição do destino ao fim do percurso. Usar
    // a posição corrente criaria uma descida e uma subida artificiais da câmera.
    const destinationY=progress<1?rect.top-(scrollStart+scrollDistance-scrollY):rect.top;
    const targetFrame={x:rect.left,y:destinationY,width:Math.max(1,rect.width),height:Math.max(1,rect.height)};
    const next=pose(spec,base,targetFrame,progress);
    diagnostics.progress=progress;diagnostics.frame=next.frame;diagnostics.crop=next.crop;
    const visible=hero.getBoundingClientRect().bottom>0||rect.bottom>0;
    plane.hidden=!visible;renderer?.setVisible(visible);
    if(!visible)return;
    const {frame,crop}=next;
    frameElement.style.transform=`translate3d(${frame.x/cssScale}px,${frame.y/cssScale}px,0) scale(${frame.width/base.width},${frame.height/base.height})`;
    poster.style.transform=`matrix(${1/crop.width},0,0,${1/crop.height},${-crop.x*base.width/cssScale/crop.width},${-crop.y*base.height/cssScale/crop.height})`;
    const atmosphere=smooth((progress-.1)/.68);
    story.style.setProperty('--story-color',`rgb(${Math.round(lerp(8,233,atmosphere))} ${Math.round(lerp(60,249,atmosphere))} ${Math.round(lerp(99,231,atmosphere))})`);
    // A leitura da margem começa quando o quadro libera sua área no desktop.
    // No mobile o título vem depois da foto e entra pelo fluxo normal.
    story.style.setProperty('--intro-opacity',String(smooth((progress-.8)/.18)));
    shade.style.opacity=String(1-smooth((progress-.08)/.67));
    composition.style.opacity=String(1-smooth((progress-.08)/.45));
    renderer?.update(crop,progress);
  }
  function schedule(){if(!frameRequest&&!disposed&&!document.hidden)frameRequest=requestAnimationFrame(update);}

  async function loadSource(){
    await image.decode().catch(()=>undefined);
    if(disposed||reduced.matches)return;
    const next=image.currentSrc||image.src;
    if(next===source&&ready)return;
    const generation=++sourceGeneration;
    spec=next.includes('vertical')?vertical:horizontal;
    source=next;diagnostics.source=source;
    poster.src=next;
    await poster.decode().catch(()=>undefined);
    if(disposed||generation!==sourceGeneration||reduced.matches)return;
    ready=true;story.classList.add('motion-ready');plane.hidden=false;
    update();
    if(params.get('grafico')==='fallback'){fallback('Alternativa visual solicitada.');return;}
    try{
      const {ContinuityRenderer:Renderer}=await import('./ContinuityRenderer');
      if(disposed||generation!==sourceGeneration||reduced.matches)return;
      renderer?.dispose();
      const candidate=new Renderer(holder,fallback,params.get('mascara')==='1',params.get('qualidade')==='baixa');
      renderer=candidate;
      diagnostics.graphics=candidate.diagnostics;
      candidate.resize(base.width,base.height);
      candidate.update(diagnostics.crop,progress);
      await candidate.load(params.get('textura')==='falha'?'/studies/etapa-2/textura-indisponivel.webp':source,spec);
      if(generation!==sourceGeneration||reduced.matches||disposed){candidate.dispose();return;}
      update();
    }catch(error){if(generation===sourceGeneration)fallback(error instanceof Error?error.message:'Falha gráfica.');}
  }

  function resize(){
    if(disposed)return;
    const rect=hero.getBoundingClientRect();
    cssScale=Number(getComputedStyle(document.documentElement).zoom)||1;
    base={x:0,y:0,width:document.documentElement.clientWidth,height:rect.height};
    frameElement.style.width=`${base.width/cssScale}px`;frameElement.style.height=`${base.height/cssScale}px`;
    poster.style.width=`${base.width/cssScale}px`;poster.style.height=`${base.height/cssScale}px`;
    scrollStart=scrollY+rect.top;
    scrollDistance=Math.max(1,base.height*(matchMedia('(max-width:699px)').matches?.90:.95));
    state.progress=clamp((scrollY-scrollStart)/scrollDistance);
    renderer?.resize(base.width,base.height);
    schedule();
    if(!reduced.matches)void loadSource();
  }

  async function motion(){
    cleanupScroll();cleanupScroll=()=>{};
    if(reduced.matches){
      sourceGeneration++;renderer?.dispose();renderer=undefined;ready=false;source='';
      story.classList.remove('motion-ready');plane.hidden=true;story.style.removeProperty('--story-color');
      composition.style.removeProperty('opacity');
      story.style.removeProperty('--intro-opacity');
      diagnostics.motion='reduced-motion';diagnostics.graphics={mode:'reduced-motion'};
      return;
    }
    const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
    if(disposed||reduced.matches)return;
    gsap.registerPlugin(ScrollTrigger);
    diagnostics.motion='scroll';
    resize();
    const animation=gsap.fromTo(state,{progress:0},{progress:1,ease:'none',immediateRender:false,scrollTrigger:{trigger:hero,start:'top top',end:()=>`+=${scrollDistance}`,scrub:true,invalidateOnRefresh:true,onRefresh:()=>{state.progress=clamp((scrollY-scrollStart)/scrollDistance);schedule();}},onUpdate:schedule});
    cleanupScroll=()=>{animation.scrollTrigger?.kill();animation.kill();};
    // O destino continua no fluxo nativo depois da timeline, inclusive quando é sticky.
    window.addEventListener('scroll',schedule,{passive:true});
    const originalCleanup=cleanupScroll;
    cleanupScroll=()=>{window.removeEventListener('scroll',schedule);originalCleanup();};
    schedule();
  }
  function onPreference(){void motion();}
  function onVisibility(){if(!document.hidden){resize();schedule();}}
  const observer=new ResizeObserver(()=>resize());
  observer.observe(hero);observer.observe(target);
  reduced.addEventListener('change',onPreference);
  document.addEventListener('visibilitychange',onVisibility);
  window.addEventListener('resize',schedule,{passive:true});
  // BFCache preserva o documento; só descarta recursos se a página sair definitivamente.
  function onPageHide(event:PageTransitionEvent){if(!event.persisted)dispose();}
  window.addEventListener('pagehide',onPageHide);
  function dispose(){
    if(disposed)return;disposed=true;sourceGeneration++;cancelAnimationFrame(frameRequest);
    cleanupScroll();renderer?.dispose();observer.disconnect();
    reduced.removeEventListener('change',onPreference);document.removeEventListener('visibilitychange',onVisibility);
    window.removeEventListener('resize',schedule);window.removeEventListener('pagehide',onPageHide);
    story.classList.remove('motion-ready');plane.hidden=true;diagnostics.motion='disposed';
    composition.style.removeProperty('opacity');
    story.style.removeProperty('--intro-opacity');
    story.style.removeProperty('--story-color');
  }
  await document.fonts.ready;
  if(!disposed)await motion();
}
