import {mkdir,readFile,writeFile,copyFile,rename,readdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {launch} from '../browser.mjs';

const exec=promisify(execFile);
const baseURL=process.env.BASE_URL||'http://127.0.0.1:4322';
const root='docs/redirecao/etapa-2';const shots=`${root}/evidencias`;const videos=`${root}/videos`;
const publicRoot='public/studies/etapa-2/revisao';
for(const path of [shots,videos,publicRoot,`${publicRoot}/videos`])await mkdir(path,{recursive:true});
const manifest={date:'2026-11-10',browser:'',screenshots:[],videos:[],performance:{},frameSequences:[]};
const browser=await launch();manifest.browser=`Chromium ${browser.version()}`;
async function prepare(page,route='/estudos/etapa-2/'){
  await page.goto(baseURL+route);await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  if(route.includes('etapa-2'))await page.waitForFunction(()=>window.__laminaContinuity&&window.__laminaContinuity.graphics.mode!=='loading');
  await page.waitForTimeout(350);
}
async function position(page,t){await page.evaluate(t=>{const h=document.querySelector('.hero').getBoundingClientRect().height;scrollTo(0,t*h*(innerWidth<700?.9:.95));},t);await page.waitForTimeout(130);}
async function shot(page,name){const path=`${shots}/${name}.png`;await page.screenshot({path});manifest.screenshots.push({name,path,viewport:page.viewportSize(),state:await page.evaluate(()=>window.__laminaContinuity?{progress:window.__laminaContinuity.progress,frame:window.__laminaContinuity.frame,crop:window.__laminaContinuity.crop,mode:window.__laminaContinuity.graphics.mode}:null)});return path;}

try{
  const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
  for(const [name,width,height]of[['desktop',1440,900],['wide',1920,1080],['tablet-768',768,1024],['tablet',820,1180],['tablet-1024',1024,900],['tablet-horizontal',1180,820],['small',320,700],['mobile-375',375,812],['mobile',390,844],['mobile-430',430,932]]){
    await page.setViewportSize({width,height});await prepare(page);
    for(const [t,label]of [[0,'hero'],[.35,'inicio'],[.65,'passagem'],[1,'servicos']]){await position(page,t);await shot(page,`${name}-${label}`);}
    if(['desktop','tablet','mobile'].includes(name)){
      await page.locator('#orcamento').scrollIntoViewIfNeeded();await shot(page,`${name}-orcamento`);
      await prepare(page,'/estudos/etapa-1/');await shot(page,`${name}-anterior-a`);
      await page.locator('#servicos').scrollIntoViewIfNeeded();await shot(page,`${name}-anterior-servicos`);
      await prepare(page,'/');await shot(page,`${name}-original`);
    }
    console.log('Capturado',name,width,height);
  }
  for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
    await page.setViewportSize({width,height});await prepare(page,'/estudos/etapa-2/?grafico=fallback');
    for(const[t,label]of[[0,'hero'],[.65,'passagem'],[1,'servicos']]){await position(page,t);await shot(page,`${name}-fallback-${label}`);}
    await page.emulateMedia({reducedMotion:'reduce'});await prepare(page);await shot(page,`${name}-movimento-reduzido`);await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.setViewportSize({width:1440,height:900});await prepare(page,'/estudos/etapa-2/?mascara=1');await shot(page,'mascara-horizontal');
  await page.setViewportSize({width:390,height:844});await prepare(page,'/estudos/etapa-2/?mascara=1');await shot(page,'mascara-vertical');
  // Medição em produção sem screenshot ou gravação concorrente.
  await page.setViewportSize({width:1440,height:900});await prepare(page);
  manifest.performance=await page.evaluate(async()=>{
    const canvas=document.querySelector('.canvas-holder canvas');const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');const ext=gl.getExtension('WEBGL_debug_renderer_info');
    const gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
    const intervals=[];let previous=performance.now();const h=document.querySelector('.hero').getBoundingClientRect().height;
    for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const now=performance.now();intervals.push(now-previous);previous=now;scrollTo(0,h*.95*i/89);}
    intervals.sort((a,b)=>a-b);return {gpu,samples:intervals.length,rafMedian:intervals[Math.floor(intervals.length*.5)],rafP95:intervals[Math.floor(intervals.length*.95)],graphics:window.__laminaContinuity.graphics,notes:'Intervalos rAF em rolagem programática. Não mede apresentação da GPU, INP de campo ou FPS do vídeo.'};
  });
  // Cabeçalhos das pranchas também são renderizados no navegador.
  const labels=new Map();
  for(const[name,width]of[['desktop',1440],['tablet',820],['mobile',390]]){
    await page.setViewportSize({width:width*3,height:80});await page.setContent(`<head><link rel="icon" href="/favicon.svg"></head><body style="margin:0;display:grid;grid-template-columns:repeat(3,1fr);background:#083c63;color:#e9f9e7;font:15px Arial"><div style="padding:12px 18px">Original</div><div style="padding:12px 18px">Etapa 1 · A</div><div style="padding:12px 18px">Etapa 2 · cor e continuidade</div></body>`);labels.set(name,await page.screenshot({clip:{x:0,y:0,width:width*3,height:44}}));
  }
  for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844]]){
    const layers=[{input:labels.get(name),left:0,top:0}];for(const[file,index]of[[`${name}-original`,0],[`${name}-anterior-a`,1],[`${name}-hero`,2]])layers.push({input:await readFile(`${shots}/${file}.png`),left:index*width,top:44});
    await sharp({create:{width:width*3,height:height+44,channels:3,background:'#083c63'}}).composite(layers).png().toFile(`${shots}/${name}-comparacao-cromatica.png`);
    await sharp(`${shots}/${name}-comparacao-cromatica.png`).resize({width:Math.min(width*3,2160)}).webp({quality:86}).toFile(`${publicRoot}/${name}-comparacao.webp`);
    const before=await readFile(`${shots}/${name}-anterior-servicos.png`),after=await readFile(`${shots}/${name}-servicos.png`);
    await sharp({create:{width:width*2,height,channels:3,background:'#083c63'}}).composite([{input:before,left:0,top:0},{input:after,left:width,top:0}]).png().toFile(`${shots}/${name}-servicos-comparacao.png`);
  }
  for(const name of ['desktop-hero','desktop-inicio','desktop-passagem','desktop-servicos','mobile-hero','mobile-passagem','mobile-servicos','desktop-fallback-passagem','mobile-fallback-servicos','mascara-horizontal','mascara-vertical'])await sharp(`${shots}/${name}.png`).resize({width:Math.min(name.startsWith('mobile')||name==='mascara-vertical'?390:1200,1920),withoutEnlargement:true}).webp({quality:86}).toFile(`${publicRoot}/${name}.webp`);
  await context.close();

  // Vídeos brutos do navegador. O mesmo código da página é executado; sem pós-animação.
  for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
    const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:name==='mobile',isMobile:name==='mobile',recordVideo:{dir:videos,size:{width,height}}});
    const p=await ctx.newPage();await prepare(p);await p.waitForTimeout(500);
    const h=await p.locator('.hero').evaluate(e=>e.getBoundingClientRect().height);
    if(name==='desktop'){
      for(let i=0;i<75;i++){await p.mouse.wheel(0,h*1.12/75);await p.waitForTimeout(28);}
      await p.waitForTimeout(600);
      for(let i=0;i<65;i++){await p.mouse.wheel(0,-h*1.12/65);await p.waitForTimeout(25);}
      await p.waitForTimeout(450);await p.mouse.wheel(0,h*1.15);await p.waitForTimeout(600);await p.mouse.wheel(0,-h*1.15);await p.waitForTimeout(500);
    }else{
      const cdp=await ctx.newCDPSession(p);
      async function swipe(start,end){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:start}]});for(let i=1;i<=24;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:start+(end-start)*i/24}]});await p.waitForTimeout(20);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(260);}
      await swipe(720,240);await swipe(720,240);await p.waitForTimeout(600);await swipe(220,720);await swipe(220,720);await p.waitForTimeout(500);
    }
    const video=p.video();await ctx.close();const source=await video.path();const destination=`${videos}/transicao-${name}.webm`;await rename(source,destination);await copyFile(destination,`${publicRoot}/videos/transicao-${name}.webm`);
    const bytes=await readFile(destination);manifest.videos.push({name,path:destination,width,height,sha256:createHash('sha256').update(bytes).digest('hex'),interaction:name==='mobile'?'Gestos de toque via CDP; rolagem e animação reais da página.':'Wheel nativo: ida lenta, reversão, deslocamento rápido e retorno.',edited:false});
    console.log('Vídeo gravado',name);
  }
}finally{await browser.close();}

const ffmpeg=resolve('.cache/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe');
for(const name of ['desktop','mobile']){
  const directory=`${root}/quadros-${name}`;await mkdir(directory,{recursive:true});
  await exec(ffmpeg,['-y','-i',resolve(`${videos}/transicao-${name}.webm`),'-vf',name==='mobile'?'scale=195:-1':'scale=480:-1','-r','1','-frames:v','12',resolve(`${directory}/quadro-%02d.png`)]);
  const files=(await readdir(directory)).filter(f=>f.endsWith('.png')).sort();const width=name==='mobile'?195:480;const height=name==='mobile'?422:300;
  const layers=await Promise.all(files.map(async(file,i)=>({input:await readFile(`${directory}/${file}`),left:(i%4)*width,top:Math.floor(i/4)*height})));
  const path=`${shots}/video-${name}-sequencia.png`;await sharp({create:{width:width*4,height:height*Math.ceil(files.length/4),channels:3,background:'#083c63'}}).composite(layers).png().toFile(path);
  manifest.frameSequences.push({path,sourceVideo:`${videos}/transicao-${name}.webm`,sampling:'1 quadro por segundo, até 12 quadros, sem interpolação.'});
}
await writeFile(`${root}/evidencias.json`,JSON.stringify(manifest,null,2));console.log('Evidências registradas',manifest.screenshots.length,manifest.videos.length);
