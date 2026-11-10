import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../browser.mjs';
const output=process.env.EVIDENCE_DIR||'docs/redirecao/etapa-2';
const assets=process.env.REVIEW_ASSETS||'/studies/etapa-2/revisao';
const videoPrefix=process.env.REVIEW_VIDEO_PREFIX||'transicao';
const browser=await launch();const out={checks:[],errors:[]};
try{
  const context=await browser.newContext();const page=await context.newPage();page.on('pageerror',e=>out.errors.push(e.message));
  for(const width of [320,390,820,1440]){
    await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4322/estudos/etapa-2/revisao/');
    await page.evaluate(async()=>{await document.fonts.ready;for(const detail of document.querySelectorAll('details'))detail.open=true;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
    const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:document.images.length,title:document.title}));
    const axe=await new AxeBuilder({page}).analyze();
    out.checks.push({name:`Galeria online ${width}px`,...geometry,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.length})),passed:!geometry.overflow&&!axe.violations.length});
  }
  for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
    await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4322/estudos/etapa-2/revisao/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${output}/evidencias/revisao-${name}.png`});
  }
  const media=[];for(const name of ['desktop','mobile']){const response=await page.request.get(`http://127.0.0.1:4322${assets}/videos/${videoPrefix}-${name}.webm`);media.push({name,status:response.status(),bytes:(await response.body()).length});}out.checks.push({name:'Vídeos brutos disponíveis na galeria',media,passed:media.every(m=>m.status===200&&m.bytes>1000)});
  await page.goto(pathToFileURL(resolve(`${output}/index.html`)).href);
  await page.evaluate(async()=>{for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
  out.checks.push({name:'Galeria local: todas as imagens decodificam',images:await page.locator('img').count(),passed:true});
}catch(error){out.errors.push(error.message);}finally{await browser.close();}
out.passed=out.errors.length===0&&out.checks.every(c=>c.passed);await writeFile(`${output}/revisao.json`,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(!out.passed)process.exitCode=1;
