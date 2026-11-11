import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../../browser.mjs';

const base=process.env.BASE_URL||'http://127.0.0.1:4322',root='docs/redirecao/etapa-3';
const result={checks:[],errors:[]},browser=await launch();
const assert=(condition,message)=>{if(!condition)throw Error(message);};
try{
  const context=await browser.newContext();const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  // Focused checks after the last photographic crop and mobile margin refinements.
  for(const width of [320,375,390,430,768,820,1024,1280,1440,1920]){
    await page.setViewportSize({width,height:width<700?844:width<900?1180:900});await page.goto(base+'/estudos/etapa-3/');
    await page.evaluate(async()=>{await document.fonts.ready;[...document.images].forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    const heights=[];
    for(const id of ['luz','jardim','noite']){await page.locator(`[data-atmosphere-select=${id}]`).evaluate(e=>e.click());await page.waitForFunction(id=>document.querySelector(`[data-atmosphere-select=${id}]`).getAttribute('aria-pressed')==='true',id);heights.push(await page.locator('.atmosphere-stage').evaluate(e=>e.getBoundingClientRect().height));}
    assert(Math.max(...heights)-Math.min(...heights)<1,'Galeria mudou de altura em '+width);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow final '+width);
    assert(await page.locator('.materials-photo img').evaluate(i=>i.currentSrc.includes('vertical')&&i.naturalWidth>0),'Recorte vertical de materiais não carregou');
    result.checks.push({name:`${width}px: enquadramento final, galeria estável e ausência de overflow`,passed:true,galleryHeights:heights});
    if([390,820,1440].includes(width)){
      const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));assert(!violations.length,JSON.stringify(violations));result.checks.push({name:`${width}px: axe após refinamento fotográfico e da margem`,passed:true,violations:0});
    }
  }
  for(const width of [320,390,820,1440]){
    await page.setViewportSize({width,height:width<700?844:1180});await page.goto(base+'/estudos/etapa-3/revisao/');
    await page.evaluate(async()=>{await document.fonts.ready;[...document.images].forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode()));});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+width);
    const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
    assert(!violations.length,JSON.stringify({width,violations}));result.checks.push({name:`${width}px: imagens, overflow e axe da apresentação`,passed:true,violations:0});
    if([390,820,1440].includes(width))await page.screenshot({path:`${root}/evidencias/apresentacao-${width}.png`,fullPage:true});
  }
  const assets=await page.evaluate(()=>[...new Set([...document.querySelectorAll('a[href],img[src],source[src]')].map(e=>e.href||e.src).filter(Boolean))]);
  for(const url of assets){const response=await fetch(url);assert(response.ok,`Recurso ${response.status}: ${url}`);await response.arrayBuffer();}
  result.checks.push({name:'Links e recursos da apresentação respondem 200',passed:true,count:assets.length});
  const videos=[];
  for(const video of await page.locator('video').all()){
    const playback=await video.evaluate(async element=>{element.muted=true;await element.play();await new Promise(r=>setTimeout(r,350));element.pause();return{duration:element.duration,time:element.currentTime,width:element.videoWidth,height:element.videoHeight};});
    assert(playback.time>0&&playback.duration>20,'Vídeo não reproduz: '+JSON.stringify(playback));videos.push(playback);
  }
  result.checks.push({name:'Duas gravações reproduzem no navegador',passed:true,videos});
  const evidence=JSON.parse(await readFile(`${root}/evidencias.json`,'utf8'));
  for(const video of evidence.videos){const local=await readFile(video.path),pub=await readFile(`public/studies/etapa-3/videos/percurso-${video.name}.webm`);assert(local.equals(pub),'Cópia diferente '+video.name);assert(createHash('sha256').update(local).digest('hex')===video.sha256,'Hash diferente');}
  result.checks.push({name:'Vídeos públicos idênticos aos originais brutos',passed:true});
}catch(error){result.checks.push({name:'Apresentação',passed:false,error:error.message});console.log('FAIL',error.message);}
finally{await browser.close();}
result.summary={checks:result.checks.length,passed:result.checks.filter(c=>c.passed).length,failed:result.checks.filter(c=>!c.passed).length,errors:result.errors.length};
await writeFile(`${root}/revisao.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary));if(result.summary.failed||result.errors.length)process.exitCode=1;
