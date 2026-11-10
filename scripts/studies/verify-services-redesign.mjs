import {readFile,writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';
import AxeBuilder from '@axe-core/playwright';
import {launch} from '../browser.mjs';
const exec=promisify(execFile);
const root='docs/redirecao/etapa-2/servicos';
const output={checks:[],errors:[]};
const assert=(value,message)=>{if(!value)throw Error(message);};
async function check(name,fn){try{const detail=await fn();output.checks.push({name,passed:true,detail});console.log('PASS',name);}catch(error){output.checks.push({name,passed:false,error:error.message});console.log('FAIL',name,error.message);}}
await check('Escopo preserva original, A/B, dados comerciais, AGENTS e Skills',async()=>{
  const files=(await exec('git',['diff','--name-only','HEAD'])).stdout.trim().split(/\r?\n/).filter(Boolean);
  assert(files.every(f=>f.startsWith('src/studies/etapa-2/')||f.startsWith('src/pages/estudos/etapa-2')||['scripts/studies/verify-stage2.mjs','scripts/studies/review-stage2.mjs'].includes(f)),'Arquivo fora do escopo: '+files.join(', '));
  const old=await readFile(`${root}/anterior/Story.astro.txt`,'utf8');const current=await readFile('src/studies/etapa-2/Story.astro','utf8');
  const hero=t=>t.slice(t.indexOf('<section class="hero"'),t.indexOf('</section>')+10).replaceAll('\r\n','\n');
  assert(hero(old)===hero(current),'Conteúdo do hero alterado');
  for(const file of ['ContinuityRenderer.ts','shaders.ts'])assert((await readFile(`src/studies/etapa-2/${file}`)).equals(await readFile(`${root}/anterior/${file}.txt`)),file+' alterado');
  return {trackedChanges:files,heroUnchanged:true,rendererAndShaderUnchanged:true};
});
const browser=await launch();
try{
 const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
 page.on('pageerror',error=>output.errors.push(error.message));
 async function ready(){await page.goto('http://127.0.0.1:4322/estudos/etapa-2/');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');}
 for(const width of [320,375,390,430,768,820,1024,1440,1920]){
  const height=width<700?844:width<900?1180:900;
  await page.setViewportSize({width,height});await ready();
  await check(`${width}px: título, panorama e serviços sem overflow, axe e foco`,async()=>{
   const violations=[];
   for(const state of ['intermediate','arrival','offer']){
    await page.evaluate(state=>{const hero=document.querySelector('.hero').offsetHeight;const offer=document.querySelector('.services-offer');scrollTo(0,state==='offer'?scrollY+offer.getBoundingClientRect().top:state==='arrival'?hero:hero*.65*(innerWidth<700?.9:.95));},state);
    await page.waitForTimeout(140);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+state);
    if([390,820,1440].includes(width))violations.push(...(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>({id:v.id,state,nodes:v.nodes.length})));
   }
   assert(!violations.length,JSON.stringify(violations));
   const rows=await page.locator('.service').count();assert(rows===3,'Serviço ausente');
   for(const id of ['projeto','revitalizacao','manutencao']){
    const action=page.locator(`[data-select-service="${id}"]`);await action.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
    const focus=await action.evaluate(e=>({focused:e===document.activeElement,style:getComputedStyle(e).outlineStyle,height:e.getBoundingClientRect().height}));
    assert(focus.focused&&focus.style!=='none'&&focus.height>=44,JSON.stringify(focus));
    await page.keyboard.press('Enter');assert(await page.locator(`[name="servico"][value="${id}"]`).isChecked(),'Pré-seleção '+id);
   }
   return {services:rows,allSelections:true,axeViolations:violations.length,axeExecuted:[390,820,1440].includes(width)};
  });
 }
 for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844]]){
  await page.setViewportSize({width,height});await ready();
  await check(`${name}: pôster e WebGL coincidem no novo destino`,async()=>{
   await page.evaluate(()=>scrollTo(0,document.querySelector('.hero').offsetHeight));await page.waitForTimeout(200);
   assert(await page.locator('[data-destination] picture').evaluate(e=>getComputedStyle(e).opacity==='0'),'Pôster duplicado durante WebGL');
   const rect=await page.locator('[data-destination] picture').boundingBox();const clip={x:Math.ceil(rect.x),y:Math.ceil(rect.y+Math.min(100,rect.height*.2)),width:Math.floor(rect.width)-2,height:Math.floor(Math.min(rect.height-Math.min(100,rect.height*.2),height-rect.y-Math.min(100,rect.height*.2)))-2};
   const webglPNG=await page.screenshot({clip});
   await page.evaluate(()=>{document.querySelector('[data-visual-plane]').style.visibility='hidden';document.querySelector('[data-destination] picture').style.opacity='1';});
   const htmlPNG=await page.screenshot({clip});
   const difference=async width=>{
    const webgl=await sharp(webglPNG).resize({width}).removeAlpha().raw().toBuffer();const html=await sharp(htmlPNG).resize({width}).removeAlpha().raw().toBuffer();
    return webgl.reduce((total,value,index)=>total+Math.abs(value-html[index]),0)/webgl.length;
   };
   const rawDifference=await difference(clip.width);const difference256=await difference(Math.min(256,clip.width));const framingDifference=await difference(Math.min(64,clip.width));
   await page.evaluate(()=>{document.querySelector('[data-visual-plane]').style.removeProperty('visibility');document.querySelector('[data-destination] picture').style.removeProperty('opacity');});
   // A amostragem bilinear da textura difere do filtro nativo do navegador.
   // A versão reduzida compara cobertura e enquadramento sem exigir filtros idênticos.
   const source=await page.locator('[data-destination] img').evaluate(e=>e.currentSrc);assert(source===await page.evaluate(()=>window.__laminaContinuity.source),'Fontes diferentes no destino');
   const frame=await page.evaluate(()=>window.__laminaContinuity.frame);assert(Math.max(Math.abs(frame.x-rect.x),Math.abs(frame.y-rect.y),Math.abs(frame.width-rect.width),Math.abs(frame.height-rect.height))<1.5,'Quadro desalinhado');
   assert(framingDifference<1.5,`Diferença média de canais em 64px ${framingDifference}`);return {rawMeanChannelDifference:rawDifference,meanChannelDifference256:difference256,meanChannelDifference64:framingDifference,source,clip};
  });
 }
 await check('Zoom 200% mantém título e ações legíveis e dentro da tela',async()=>{
  await page.setViewportSize({width:820,height:1180});await ready();await page.evaluate(()=>document.documentElement.style.zoom='2');await page.waitForTimeout(300);
  for(const selector of ['#services-title','.services-offer','[data-select-service="manutencao"]']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(100);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow em '+selector);}
  await page.evaluate(()=>document.documentElement.style.removeProperty('zoom'));
 });
 await check('Âncoras e faixa de ligação mantêm destino acessível',async()=>{await ready();await page.locator('.services-bridge a').focus();await page.keyboard.press('Enter');assert(await page.evaluate(()=>location.hash==='#services-offer'),'Âncora da oferta inválida');assert(await page.locator('.service-projeto').isVisible(),'Oferta indisponível');});
 await context.close();
}finally{await browser.close();}
output.summary={checks:output.checks.length,passed:output.checks.filter(c=>c.passed).length,failed:output.checks.filter(c=>!c.passed).length,errors:output.errors.length};
await writeFile(`${root}/testes-servicos.json`,JSON.stringify(output,null,2));console.log(output.summary);if(output.summary.failed||output.errors.length)process.exitCode=1;
