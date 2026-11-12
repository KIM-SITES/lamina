import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { launch } from '../../browser.mjs';
const root='docs/redirecao/etapa-4',publicRoot='public/studies/etapa-4/comparacoes',base=process.env.BASE_URL||'http://127.0.0.1:4322';
await mkdir(`${root}/comparacoes`,{recursive:true});await mkdir(publicRoot,{recursive:true});
const report={date:'2026-11-11',viewports:[],screenshots:[],notes:'Capturas reais de ambas as rotas nesta execução. Limites com movimento ativo e mesma coordenada vertical; capturas integrais com movimento reduzido nativo. Não são prova de interação.'};
const dimensions={},browser=await launch();
async function shot(page,name,fullPage=false){const path=`${root}/comparacoes/${name}.png`,buffer=await page.screenshot({path,fullPage}),meta=await sharp(buffer).metadata();const info=await sharp(buffer).resize({width:fullPage?Math.min(meta.width,840):Math.min(meta.width,1200),withoutEnlargement:true}).webp({quality:88}).toFile(`${publicRoot}/${name}.webp`);dimensions[name]={width:info.width,height:info.height};report.screenshots.push({name,path,width:meta.width,height:meta.height,fullPage});}
try{
  const context=await browser.newContext({deviceScaleFactor:1}),page=await context.newPage();
  for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844],['small',320,700]]){
    const layouts={};
    for(const[state,stage]of[['antes',3],['depois',4]]){
      await page.setViewportSize({width,height});await page.goto(`${base}/estudos/etapa-${stage}/`);
      await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
      await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
      layouts[state]=await page.evaluate(()=>({pageHeight:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('.hero,#servicos,#ambientes,#materiais,#processo,#orcamento,.closing')].map(e=>({id:e.id||e.className,height:e.getBoundingClientRect().height})),processFont:getComputedStyle(document.querySelector('.process-path p:last-child')).fontSize}));
      for(const selector of ['#servicos','#ambientes','#materiais','#processo','#orcamento','.closing']){
        await page.locator(selector).evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top-innerHeight*.24));await page.waitForTimeout(180);await shot(page,`${name}-${selector.replace(/[.#]/g,'')}-${state}`);
      }
      await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(130);await shot(page,`${name}-completa-${state}`,true);
      await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
    }
    report.viewports.push({name,width,height,...layouts,reductionPixels:layouts.antes.pageHeight-layouts.depois.pageHeight,reductionPercent:+((1-layouts.depois.pageHeight/layouts.antes.pageHeight)*100).toFixed(2)});console.log('Comparação real',name);
  }
  await context.close();
}finally{await browser.close();}
await writeFile(`${root}/comparacao.json`,JSON.stringify(report,null,2));await writeFile(`${publicRoot}/dimensoes.json`,JSON.stringify(dimensions,null,2));console.log(JSON.stringify(report.viewports));
