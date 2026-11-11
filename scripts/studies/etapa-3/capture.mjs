import { mkdir, writeFile, readFile, rename, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { launch } from '../../browser.mjs';

const exec=promisify(execFile);
const root='docs/redirecao/etapa-3';
const publicRoot='public/studies/etapa-3';
const base=process.env.BASE_URL||'http://127.0.0.1:4322';
const route=base+'/estudos/etapa-3/';
for(const directory of [`${root}/evidencias`,`${root}/videos`,`${publicRoot}/evidencias`,`${publicRoot}/videos`])await mkdir(directory,{recursive:true});
const manifest={date:'2026-11-11',route,screenshots:[],videos:[],reviewImages:{}};
const browser=await launch();
async function ready(page,query=''){
  await page.goto(route+query);
  await page.evaluate(async()=>{
    await document.fonts.ready;
    [...document.images].forEach(image=>image.loading='eager');
    await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
  });
  await page.waitForFunction(()=>window.__laminaContinuity?.motion==='scroll'||window.__laminaContinuity?.motion==='reduced-motion');
  await page.waitForTimeout(240);
}
async function top(page,selector){await page.locator(selector).evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top));await page.waitForTimeout(160);}
async function shot(page,name,{selector,fullPage=false,reduced=false}={}){
  const path=`${root}/evidencias/${name}.png`;
  const buffer=selector?await page.locator(selector).screenshot({path}):await page.screenshot({path,fullPage});
  const meta=await sharp(buffer).metadata();
  const preview=`${publicRoot}/evidencias/${name}.webp`;
  const info=await sharp(buffer).resize({width:fullPage?Math.min(meta.width,840):Math.min(meta.width,1200),withoutEnlargement:true}).webp({quality:86}).toFile(preview);
  manifest.reviewImages[name]={width:info.width,height:info.height};
  manifest.screenshots.push({name,path,preview,width:meta.width,height:meta.height,viewport:page.viewportSize(),fullPage,reducedMotion:reduced,sha256:createHash('sha256').update(buffer).digest('hex')});
}
try{
  const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
  for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844]]){
    await page.setViewportSize({width,height});await ready(page);
    await shot(page,`${name}-hero`);
    await page.evaluate(()=>scrollTo(0,document.querySelector('.hero').offsetHeight*(innerWidth<700?.9:.95)*.62));await page.waitForTimeout(180);await shot(page,`${name}-passagem`);
    await top(page,'#servicos');await shot(page,`${name}-servicos`);
    for(const id of ['luz','jardim','noite']){
      await page.locator(`[data-atmosphere-select=${id}]`).evaluate(e=>e.click());await page.waitForTimeout(120);await top(page,'#ambientes');await shot(page,`${name}-ambiente-${id}`,{selector:'#ambientes'});
    }
    for(const[nameSuffix,selector]of[['materiais','#materiais'],['processo','#processo'],['orcamento','#orcamento'],['encerramento','.closing-invitation'],['marca','.closing-signature']]){
      await top(page,selector);await shot(page,`${name}-${nameSuffix}`,{selector});
    }
    await page.locator('input[value=revitalizacao]').check();await page.getByLabel('Residência',{exact:true}).check();await page.locator('[data-quote-submit]').click();await shot(page,`${name}-resumo`,{selector:'#orcamento'});
    await ready(page);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(120);await page.evaluate(()=>scrollTo(0,0));
    await shot(page,`${name}-completa`,{fullPage:true,reduced:true});await page.emulateMedia({reducedMotion:'no-preference'});
    await ready(page,'?grafico=fallback');await top(page,'#servicos');await shot(page,`${name}-fallback`);
    console.log('Capturas finais',name);
  }
  for(const[name,width,height]of[['small',320,700],['wide',1920,1080]]){
    await page.setViewportSize({width,height});await ready(page);await top(page,'#ambientes');await shot(page,`${name}-ambientes`,{selector:'#ambientes'});await top(page,'.closing');await shot(page,`${name}-encerramento`,{selector:'.closing'});
  }
  await page.setViewportSize({width:820,height:1180});await ready(page);await page.evaluate(()=>document.documentElement.style.zoom='2');await page.waitForTimeout(150);await top(page,'#orcamento');await shot(page,'tablet-zoom-200');await page.evaluate(()=>document.documentElement.style.removeProperty('zoom'));
  await context.close();

  for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile',recordVideo:{dir:`${root}/videos`,size:{width,height}}});
    const page=await context.newPage();await ready(page);await page.waitForTimeout(450);
    const cdp=name==='mobile'?await context.newCDPSession(page):undefined;
    async function swipe(direction=1){
      const x=width*.51,start=direction>0?height*.82:height*.28,end=direction>0?height*.28:height*.82;
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start}]});
      for(let i=1;i<=22;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:start+(end-start)*i/22}]});await page.waitForTimeout(18);}
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(220);
    }
    async function wheelTo(target,steps=40){const distance=target-await page.evaluate(()=>scrollY);for(let i=0;i<steps;i++){await page.mouse.wheel(0,distance/steps);await page.waitForTimeout(22);}await page.waitForTimeout(200);}
    async function nativeTo(selector){
      const target=await page.locator(selector).evaluate(e=>scrollY+e.getBoundingClientRect().top);
      if(name==='desktop'){await wheelTo(target);return;}
      for(let i=0;i<16;i++){
        const remaining=target-await page.evaluate(()=>scrollY);
        if(Math.abs(remaining)<height*.55)break;
        await swipe(remaining>0?1:-1);
      }
    }
    if(name==='desktop'){
      const h=await page.locator('.hero').evaluate(e=>e.offsetHeight);
      await wheelTo(h*1.12,56);await page.waitForTimeout(450);await wheelTo(h*.36,32);await page.waitForTimeout(250);await wheelTo(h*1.25,44);
    }else{await swipe();await swipe();await swipe(-1);await swipe();await swipe();}
    await nativeTo('#ambientes');
    // The gallery controls remain above the picture; selecting is an actual input action.
    await page.locator('[data-atmosphere-select=luz]').scrollIntoViewIfNeeded();
    if(name==='desktop')await wheelTo(await page.locator('.atmosphere-navigation').evaluate(e=>scrollY+e.getBoundingClientRect().top-22),15);
    await page.waitForTimeout(500);
    for(const id of ['jardim','noite','luz']){
      if(name==='mobile')await page.locator(`[data-atmosphere-select=${id}]`).tap();else await page.locator(`[data-atmosphere-select=${id}]`).click();
      await page.waitForTimeout(1000);
    }
    if(name==='mobile'){await swipe();await page.waitForTimeout(350);}
    await nativeTo('#materiais');await page.waitForTimeout(450);
    const material=page.locator('.material-notes summary').nth(1);
    if(name==='mobile')await material.tap();else await material.click();await page.waitForTimeout(500);
    await nativeTo('#processo');await page.waitForTimeout(450);
    await nativeTo('#orcamento');await page.waitForTimeout(400);
    if(name==='mobile'){await page.locator('label.choice').first().tap();await page.getByLabel('Residência',{exact:true}).tap();await page.locator('[data-quote-submit]').tap();}
    else{await page.locator('input[value=projeto]').check();await page.getByLabel('Residência',{exact:true}).check();await page.locator('[data-quote-submit]').click();}
    await page.waitForTimeout(800);await nativeTo('.closing-invitation');await page.waitForTimeout(450);await nativeTo('.closing-signature');
    if(name==='desktop')await wheelTo(await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight),24);else{await swipe();await swipe();}
    await page.waitForTimeout(700);
    const video=page.video();await context.close();const destination=`${root}/videos/percurso-${name}.webm`;await rename(await video.path(),destination);await copyFile(destination,`${publicRoot}/videos/percurso-${name}.webm`);
    const buffer=await readFile(destination);manifest.videos.push({name,path:destination,bytes:buffer.length,width,height,edited:false,sha256:createHash('sha256').update(buffer).digest('hex'),interaction:name==='desktop'?'Wheel nativo e cliques reais automatizados no Chromium.':'Gestos de toque CDP e taps reais automatizados no Chromium.'});
    console.log('Gravação final',name);
  }
}finally{await browser.close();}
await writeFile(`${root}/evidencias.json`,JSON.stringify(manifest,null,2));
await writeFile(`${publicRoot}/evidencias/dimensoes.json`,JSON.stringify(manifest.reviewImages,null,2));
await exec(process.execPath,['scripts/studies/etapa-3/package-evidence.mjs']);
console.log(JSON.stringify({screenshots:manifest.screenshots.length,videos:manifest.videos.length}));
