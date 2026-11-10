import {mkdir,readFile,writeFile,rename,copyFile,readdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {launch} from '../browser.mjs';

const exec=promisify(execFile);
const root='docs/redirecao/etapa-2/servicos';
const publicRoot='public/studies/etapa-2/servicos';
for(const directory of ['evidencias','videos','quadros-desktop','quadros-mobile'])await mkdir(`${root}/${directory}`,{recursive:true});
await mkdir(`${publicRoot}/videos`,{recursive:true});
const manifest={date:new Date().toISOString(),screenshots:[],comparisons:[],videos:[],performance:{}};
const browser=await launch();
const route='http://127.0.0.1:4322/estudos/etapa-2/';
async function ready(page,query=''){
 await page.goto(route+query);await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.waitForFunction(()=>window.__laminaContinuity&&window.__laminaContinuity.graphics.mode!=='loading');await page.waitForTimeout(200);
}
async function progress(page,t){await page.evaluate(t=>scrollTo(0,document.querySelector('.hero').offsetHeight*(innerWidth<700?.9:.95)*t),t);await page.waitForTimeout(140);}
async function sectionStart(page){await page.evaluate(()=>scrollTo(0,document.querySelector('.hero').offsetHeight));await page.waitForTimeout(140);}
async function shot(page,name,locator){const path=`${root}/evidencias/${name}.png`;if(locator)await locator.screenshot({path});else await page.screenshot({path});manifest.screenshots.push({name,path,viewport:page.viewportSize(),state:await page.evaluate(()=>({progress:window.__laminaContinuity.progress,frame:window.__laminaContinuity.frame,crop:window.__laminaContinuity.crop,mode:window.__laminaContinuity.graphics.mode}))});}
try{
 const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
 for(const[name,width,height]of[['desktop',1440,900],['wide',1920,1080],['tablet-768',768,1024],['tablet',820,1180],['tablet-1024',1024,900],['tablet-horizontal',1180,820],['small',320,700],['mobile-375',375,812],['mobile',390,844],['mobile-430',430,932]]){
  await page.setViewportSize({width,height});await ready(page);
  for(const[t,state]of[[0,'hero'],[.35,'inicio'],[.65,'passagem'],[.85,'acomodacao'],[1,'destino']]){await progress(page,t);await shot(page,`${name}-${state}`);}
  await sectionStart(page);await shot(page,`${name}-servicos`);
  await page.evaluate(()=>{const e=document.querySelector('.services-offer');scrollTo(0,scrollY+e.getBoundingClientRect().top);});await page.waitForTimeout(150);await shot(page,`${name}-oferta`);
  if(['desktop','tablet','mobile','small'].includes(name)){
   // Viewport alto para registrar a seção inteira com o canvas dentro da área visível.
   const total=await page.locator('#servicos').evaluate(e=>Math.ceil(e.getBoundingClientRect().height));await page.setViewportSize({width,height:Math.max(height,total+2)});await page.waitForTimeout(180);await sectionStart(page);await shot(page,`${name}-secao-completa`,page.locator('#servicos'));await page.setViewportSize({width,height});
  }
  console.log('Capturado',name);
 }
 for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  await page.setViewportSize({width,height});await ready(page,'?grafico=fallback');await progress(page,.65);await shot(page,`${name}-fallback-passagem`);await sectionStart(page);await shot(page,`${name}-fallback-destino`);
  await page.emulateMedia({reducedMotion:'reduce'});await ready(page);await sectionStart(page);await shot(page,`${name}-movimento-reduzido`);await page.emulateMedia({reducedMotion:'no-preference'});
 }
 // Comparações: mantém os pixels das capturas; o vazio inferior só acomoda alturas distintas.
 for(const[name,width]of[['desktop',1440],['tablet',820],['mobile',390]]){
  for(const[type,before,after]of[['viewport',`${root}/anterior/${name}-servicos.png`,`${root}/evidencias/${name}-servicos.png`],['completa',`${root}/anterior/${name}-secao-completa.png`,`${root}/evidencias/${name}-secao-completa.png`]]){
   const a=await readFile(before),b=await readFile(after);const ma=await sharp(a).metadata(),mb=await sharp(b).metadata();const height=Math.max(ma.height,mb.height);
   const path=`${root}/evidencias/${name}-comparacao-${type}.png`;await sharp({create:{width:width*2,height,channels:3,background:'#083c63'}}).composite([{input:a,left:0,top:0},{input:b,left:width,top:0}]).png().toFile(path);manifest.comparisons.push({name,type,path,before,after,pixelsResampled:false});
   await sharp(path).resize({width:Math.min(width*2,2160)}).webp({quality:87}).toFile(`${publicRoot}/${name}-comparacao-${type}.webp`);
  }
 }
 for(const name of ['desktop-servicos','desktop-oferta','desktop-inicio','desktop-passagem','desktop-acomodacao','desktop-destino','tablet-servicos','mobile-servicos','mobile-oferta','desktop-fallback-destino','mobile-fallback-destino'])await sharp(`${root}/evidencias/${name}.png`).resize({width:name.startsWith('mobile')?390:1200,withoutEnlargement:true}).webp({quality:87}).toFile(`${publicRoot}/${name}.webp`);
 for(const name of ['vertical','panorama','assimetrica'])await sharp(`${root}/alternativas/${name}-desktop.png`).resize({width:960}).webp({quality:85}).toFile(`${publicRoot}/alternativa-${name}.webp`);
 await page.setViewportSize({width:1440,height:900});await ready(page);
 manifest.performance=await page.evaluate(async()=>{
  const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),ext=gl.getExtension('WEBGL_debug_renderer_info');const intervals=[];let last=performance.now();const h=document.querySelector('.hero').offsetHeight;
  for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const now=performance.now();intervals.push(now-last);last=now;scrollTo(0,h*.95*i/89);}
  intervals.sort((a,b)=>a-b);return {gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),samples:intervals.length,rafMedian:intervals[45],rafP95:intervals[85],graphics:window.__laminaContinuity.graphics,notes:'rAF local; não mede tempo real da GPU, FPS apresentado ou desempenho em aparelho físico.'};
 });
 await context.close();
 for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:`${root}/videos`,size:{width,height}}});
  const page=await context.newPage();await ready(page);await page.waitForTimeout(450);
  if(name==='desktop'){
   const hero=await page.locator('.hero').evaluate(e=>e.offsetHeight);for(let i=0;i<100;i++){await page.mouse.wheel(0,hero*1.18/100);await page.waitForTimeout(32);}await page.waitForTimeout(650);
   const distance=await page.locator('.services-offer').evaluate(e=>e.getBoundingClientRect().top+160);for(let i=0;i<60;i++){await page.mouse.wheel(0,distance/60);await page.waitForTimeout(24);}await page.waitForTimeout(650);
   const current=await page.evaluate(()=>scrollY);for(let i=0;i<120;i++){await page.mouse.wheel(0,-current/120);await page.waitForTimeout(29);}await page.waitForTimeout(450);
   await page.mouse.wheel(0,hero*1.2);await page.waitForTimeout(450);await page.mouse.wheel(0,-hero*1.2);await page.waitForTimeout(450);
  }else{
   const cdp=await context.newCDPSession(page);
   async function swipe(start,end){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:start}]});for(let i=1;i<=25;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:start+(end-start)*i/25}]});await page.waitForTimeout(22);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(340);}
   for(let i=0;i<4;i++)await swipe(720,230);await page.waitForTimeout(650);for(let i=0;i<5;i++)await swipe(220,720);await page.waitForTimeout(650);
  }
  const video=page.video();await context.close();const destination=`${root}/videos/continuidade-${name}.webm`;await rename(await video.path(),destination);await copyFile(destination,`${publicRoot}/videos/continuidade-${name}.webm`);
  const buffer=await readFile(destination);manifest.videos.push({name,path:destination,width,height,edited:false,sha256:createHash('sha256').update(buffer).digest('hex'),interaction:name==='desktop'?'Wheel nativo: chegada, leitura da oferta, reversão e ida/volta rápida.':'Gestos CDP: chegada por toque, continuação até a oferta e reversão.'});console.log('Gravado',name);
 }
}finally{await browser.close();}
const ffmpeg=resolve('.cache/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe');
for(const name of ['desktop','mobile']){
 const directory=`${root}/quadros-${name}`;
 // Somente quadros gerados por este script, na pasta desta revisão.
 for(const file of await readdir(directory))if(/^quadro-\d+\.png$/.test(file))await unlink(resolve(directory,file));
 await exec(ffmpeg,['-y','-i',resolve(`${root}/videos/continuidade-${name}.webm`),'-vf',name==='mobile'?'scale=195:-1':'scale=480:-1','-r','1','-frames:v','16',resolve(`${directory}/quadro-%02d.png`)]);
 const files=(await readdir(directory)).filter(f=>f.endsWith('.png')).sort();const width=name==='mobile'?195:480,height=name==='mobile'?422:300;
 const layers=await Promise.all(files.map(async(file,i)=>({input:await readFile(`${directory}/${file}`),left:i%4*width,top:Math.floor(i/4)*height})));
 await sharp({create:{width:width*4,height:height*Math.ceil(files.length/4),channels:3,background:'#083c63'}}).composite(layers).png().toFile(`${root}/evidencias/video-${name}-sequencia.png`);
}
await writeFile(`${root}/evidencias.json`,JSON.stringify(manifest,null,2));console.log('Evidências finais',manifest.screenshots.length,manifest.videos.length);
