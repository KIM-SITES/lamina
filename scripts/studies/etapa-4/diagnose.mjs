import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { launch } from '../../browser.mjs';
const exec=promisify(execFile),root='docs/redirecao/etapa-4',base='http://127.0.0.1:4321';
await mkdir(`${root}/antes`,{recursive:true});
const tracked=(await exec('git',['ls-files','-z'])).stdout.split('\0').filter(Boolean);
const baseline={date:'2026-11-11',index:(await exec('git',['diff','--cached','--raw'])).stdout,files:await Promise.all(tracked.map(async path=>({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')})))};
await writeFile(`${root}/preservacao-inicial.json`,JSON.stringify(baseline,null,2));
const report={route:'/estudos/etapa-3/',viewports:[],interactions:[],screenshots:[]};
const browser=await launch();
try{
  const context=await browser.newContext(),page=await context.newPage();
  for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844],['small',320,700]]){
    await page.setViewportSize({width,height});await page.goto(base+report.route);await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
    for(const selector of ['#servicos','#ambientes','#materiais','#processo','#orcamento','.closing']){
      await page.locator(selector).evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top-innerHeight*.24));await page.waitForTimeout(180);
      const path=`${root}/antes/${name}-${selector.replace(/[.#]/g,'')}.png`;await page.screenshot({path});report.screenshots.push({name,selector,path});
    }
    report.viewports.push(await page.evaluate(()=>({width:innerWidth,height:innerHeight,pageHeight:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('.hero,#servicos,#ambientes,#materiais,#processo,#orcamento,.closing')].map(e=>({id:e.id||e.className,height:e.getBoundingClientRect().height,top:scrollY+e.getBoundingClientRect().top})),galleryMargin:document.querySelector('.atmosphere-margin').getBoundingClientRect().height,processFont:getComputedStyle(document.querySelector('.process-path p:last-child')).fontSize,materialPicture:document.querySelector('.materials-photo picture').getBoundingClientRect().height,closingPicture:document.querySelector('.closing-photo picture').getBoundingClientRect().height})));
    await page.locator('[data-atmosphere-select=jardim]').click();await page.waitForTimeout(700);const gallery=await page.locator('[data-atmosphere-select][aria-pressed=true]').getAttribute('data-atmosphere-select');
    await page.locator('.material-notes summary').nth(1).focus();await page.keyboard.press('Enter');const disclosure=await page.locator('.material-notes details').nth(1).evaluate(e=>e.open);
    await page.locator('.service [data-select-service=manutencao]').focus();await page.keyboard.press('Enter');await page.getByLabel('Residência',{exact:true}).check();await page.locator('[data-quote-submit]').click();
    report.interactions.push({name,gallery,disclosure,quote:await page.locator('[data-quote-result]').innerText()});console.log('Diagnóstico navegador',name);
  }
  await context.close();
  const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await touch.newPage();
  let release;const gate=new Promise(r=>release=r);
  await p.route('**/jardim-adentro-*.webp',async route=>{await gate;await route.continue();});
  await p.goto(base+report.route);await p.evaluate(()=>document.fonts.ready);
  await p.locator('[data-atmosphere-select=jardim]').tap();await p.waitForTimeout(250);
  report.slowImage=await p.evaluate(()=>({busy:document.querySelector('.atmosphere-stage').getAttribute('aria-busy'),visibleStatus:document.querySelector('[data-gallery-status]').textContent,selected:document.querySelector('[data-atmosphere-select][aria-pressed=true]').dataset.atmosphereSelect}));
  await p.screenshot({path:`${root}/antes/mobile-carregamento.png`});release();await p.waitForTimeout(750);await touch.close();
}finally{await browser.close();}
await writeFile(`${root}/diagnostico-navegador.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:report.viewports,slowImage:report.slowImage}));
