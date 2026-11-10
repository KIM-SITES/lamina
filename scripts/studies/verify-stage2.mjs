import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../browser.mjs';

const exec=promisify(execFile);
const url=process.env.BASE_URL||'http://127.0.0.1:4322';
const route='/estudos/etapa-2/';
const output=process.env.EVIDENCE_DIR||'docs/redirecao/etapa-2';await mkdir(output,{recursive:true});
const result={date:'2026-11-10',baseURL:url,baseline:(await exec('git',['rev-parse','HEAD'])).stdout.trim(),trackedChanges:(await exec('git',['diff','--name-only','HEAD'])).stdout.trim(),checks:[],browsers:[],viewports:[],contrast:[],normalErrors:[]};
const assert=(condition,message='Condição não atendida')=>{if(!condition)throw new Error(message);};
async function check(name,fn){try{const detail=await fn();result.checks.push({name,passed:true,detail});console.log('PASS',name);}catch(error){result.checks.push({name,passed:false,error:error.message});console.log('FAIL',name,error.message);}}
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
async function ready(page,query=''){
  await page.goto(url+route+query);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>window.__laminaContinuity&&window.__laminaContinuity.graphics.mode!=='loading');
  await page.waitForTimeout(180);
}
async function scrollProgress(page,t){
  await page.evaluate(t=>{const hero=document.querySelector('[data-hero]');const h=hero.getBoundingClientRect().height;scrollTo(0,(innerWidth<700?.90:.95)*h*t);},t);
  await page.waitForTimeout(140);
}

// Razões de contraste calculadas a partir dos tokens efetivamente utilizados.
const colors={deep:'#083c63',aqua:'#16c7ad',sun:'#f6d567',light:'#e9f9e7',blue:'#1658ba'};
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
for(const[foreground,background]of[['deep','aqua'],['sun','deep'],['light','deep'],['sun','blue'],['light','blue'],['deep','sun']]){const a=luminance(colors[foreground]),b=luminance(colors[background]);result.contrast.push({foreground,background,ratio:+((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2)});}
await check('contraste dos pares sólidos >= 4.5:1',()=>assert(result.contrast.every(r=>r.ratio>=4.5),JSON.stringify(result.contrast)));
await check('nenhuma entrada de mouse ou toque no caminho óptico',async()=>{const files=['src/studies/etapa-2/continuity.ts','src/studies/etapa-2/ContinuityRenderer.ts','src/studies/etapa-2/shaders.ts'];const text=(await Promise.all(files.map(p=>readFile(p,'utf8')))).join('\n');assert(!/pointermove|mousemove|touchmove|uPointer|uMouse|clientX|clientY|offsetX|offsetY/.test(text));});

for(const engine of ['chromium','firefox','webkit']){
  let browser;
  try{
    browser=await launch(engine,{timeout:15000});
    result.browsers.push({engine,version:browser.version()});
    const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
    const page=await context.newPage();page.setDefaultTimeout(12000);
    let collectErrors=true;
    page.on('pageerror',e=>{if(collectErrors)result.normalErrors.push({engine,message:e.message});});
    page.on('console',m=>{if(collectErrors&&m.type()==='error')result.normalErrors.push({engine,message:m.text(),location:m.location()});});
    await check(`${engine}: WebGL e repouso sem loop`,async()=>{
      await ready(page);await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');await page.waitForTimeout(500);
      const first=await page.evaluate(()=>window.__laminaContinuity.graphics.frames);await page.waitForTimeout(350);
      const second=await page.evaluate(()=>window.__laminaContinuity.graphics.frames);
      assert(second===first,`Quadros em repouso: ${first} → ${second}`);
      return await page.evaluate(()=>window.__laminaContinuity.graphics);
    });
    await check(`${engine}: reversão, interrupção e alinhamento no destino`,async()=>{
      await scrollProgress(page,.5);const before=await page.evaluate(()=>window.__laminaContinuity);
      await scrollProgress(page,.86);await scrollProgress(page,.5);const reverse=await page.evaluate(()=>window.__laminaContinuity);
      assert(Math.abs(before.crop.x-reverse.crop.x)<.003);assert(Math.abs(before.frame.y-reverse.frame.y)<2);
      await scrollProgress(page,1);
      const alignment=await page.evaluate(()=>{const r=document.querySelector('[data-destination] picture').getBoundingClientRect();const f=window.__laminaContinuity.frame;return {x:Math.abs(r.x-f.x),y:Math.abs(r.y-f.y),width:Math.abs(r.width-f.width),height:Math.abs(r.height-f.height)};});
      assert(Object.values(alignment).every(n=>n<1.5),JSON.stringify(alignment));
      await scrollProgress(page,0);assert(await page.evaluate(()=>window.__laminaContinuity.progress)<.002);return alignment;
    });
    await check(`${engine}: mouse não muda imagem ou estado gráfico`,async()=>{
      await scrollProgress(page,.5);await page.mouse.move(50,50);await page.waitForTimeout(100);
      const first=await page.screenshot();const frames=await page.evaluate(()=>window.__laminaContinuity.graphics.frames);
      for(let i=0;i<12;i++)await page.mouse.move(180+i*72,450+Math.sin(i)*120);
      await page.waitForTimeout(100);const second=await page.screenshot();
      assert(frames===await page.evaluate(()=>window.__laminaContinuity.graphics.frames),'Ponteiro solicitou novos quadros');
      assert(hash(first)===hash(second),'Ponteiro alterou os pixels');return {identicalScreenshot:true,frames};
    });
    await check(`${engine}: pausa fora da cena`,async()=>{await page.locator('#orcamento').scrollIntoViewIfNeeded();await page.waitForTimeout(180);const f=await page.evaluate(()=>window.__laminaContinuity.graphics.frames);await page.waitForTimeout(250);assert(await page.evaluate(()=>window.__laminaContinuity.graphics.frames)===f);assert(await page.locator('[data-visual-plane]').isHidden());});
    await check(`${engine}: teclado, âncoras e simulação comercial`,async()=>{
      await ready(page);await page.keyboard.press('Tab');assert(await page.locator('.skip-link').evaluate(e=>e===document.activeElement));
      await page.keyboard.press('Enter');assert(await page.locator('#services-title').evaluate(e=>e===document.activeElement));
      await page.locator('[data-select-service="revitalizacao"]').click();assert(await page.locator('[name="servico"][value="revitalizacao"]').isChecked());
      const writes=[];const onRequest=r=>{if(r.method()!=='GET')writes.push(r.url());};page.on('request',onRequest);
      await page.locator('[name="imovel"]').first().check();await page.locator('[data-quote-submit]').click();assert((await page.locator('[data-quote-result]').innerText()).includes('Nenhuma solicitação foi enviada'));
      await page.locator('[name="imovel"]').nth(1).check();assert((await page.locator('[data-quote-result]').textContent())==='');
      assert(writes.length===0);assert(await page.evaluate(()=>!localStorage.length&&!sessionStorage.length));page.off('request',onRequest);
      assert(await page.locator('a[href^="#"]').evaluateAll(links=>links.every(a=>document.getElementById(a.hash.slice(1)))));
    });
    await check(`${engine}: perda e restauração de contexto`,async()=>{
      await ready(page);await scrollProgress(page,.54);
      const supported=await page.evaluate(()=>{const canvas=document.querySelector('.canvas-holder canvas');const gl=canvas?.getContext('webgl2')||canvas?.getContext('webgl');const ext=gl?.getExtension('WEBGL_lose_context');if(!ext)return false;window.__stage2ContextExtension=ext;ext.loseContext();return true;});
      assert(supported,'Extensão de teste indisponível');
      await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='context-lost');
      assert(!await page.locator('.canvas-holder').evaluate(e=>e.classList.contains('is-ready')));
      await page.waitForTimeout(200);await page.evaluate(()=>window.__stage2ContextExtension.restoreContext());
      await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');
      assert(await page.locator('.canvas-holder').evaluate(e=>e.classList.contains('is-ready')));
    });
    await check(`${engine}: preferência de movimento em tempo real`,async()=>{
      await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
      assert(await page.locator('canvas').count()===0);assert(!await page.locator('[data-continuity]').evaluate(e=>e.classList.contains('motion-ready')));
      assert(await page.locator('[data-hero-poster]').isVisible());
      await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');
    });
    if(engine==='chromium'){
      for(const width of [320,375,390,430,768,820,1024,1280,1440,1920]){
        const height=width<700?844:width<900?1180:width===1920?1080:900;
        await check(`Chromium: ${width}px, resize em movimento e axe`,async()=>{
          await page.setViewportSize({width,height});await ready(page);await scrollProgress(page,.63);
          await page.waitForTimeout(150);
          const data=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,source:window.__laminaContinuity.source,progress:window.__laminaContinuity.progress,graphics:window.__laminaContinuity.graphics.mode}));
          result.viewports.push(data);assert(!data.overflow);assert(data.graphics==='webgl');
          if([390,820,1440].includes(width)){const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;assert(!violations.length,JSON.stringify(violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))));}
        });
      }
      await check('Chromium: rotação durante a passagem',async()=>{
        await page.setViewportSize({width:820,height:1180});await ready(page);await scrollProgress(page,.55);
        await page.setViewportSize({width:1180,height:820});await page.waitForTimeout(500);await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');
        assert(!(await page.evaluate(()=>window.__laminaContinuity.source)).includes('vertical'));assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
        await page.setViewportSize({width:820,height:1180});await page.waitForTimeout(500);assert((await page.evaluate(()=>window.__laminaContinuity.source)).includes('vertical'));
      });
      await check('Chromium: zoom 200% sem overflow',async()=>{await page.setViewportSize({width:820,height:1180});await ready(page);await page.evaluate(()=>document.documentElement.style.zoom='2');await page.waitForTimeout(350);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.evaluate(()=>document.documentElement.style.zoom='1');});
      await check('Chromium: fallback solicitado e resolução reduzida',async()=>{
        await ready(page,'?grafico=fallback');await scrollProgress(page,1);assert(await page.locator('canvas').count()===0);assert(await page.locator('[data-visual-plane]').isVisible());
        await ready(page,'?qualidade=baixa');await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');assert(await page.evaluate(()=>window.__laminaContinuity.graphics.quality)<1);
      });
      await check('Chromium: WebGL indisponível mantém enquadramento',async()=>{
        const ctx=await browser.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
        await p.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:get.call(this,type,...args);};});
        await ready(p);await scrollProgress(p,1);assert(await p.evaluate(()=>window.__laminaContinuity.graphics.mode)==='fallback');assert(await p.locator('[data-plane-poster]').isVisible());await ctx.close();
      });
      await check('Chromium: WebGL 1 sem erro de textura 2D',async()=>{
        const ctx=await browser.newContext();const p=await ctx.newPage();const errors=[];
        p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
        await p.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:get.call(this,type,...args);};});
        await ready(p);await p.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');await scrollProgress(p,.6);assert(!errors.length,errors.join('\n'));await ctx.close();
      });
      await check('Chromium: falha de textura mantém poster',async()=>{
        collectErrors=false;await ready(page,'?textura=falha');await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='fallback');await scrollProgress(page,.65);assert(await page.locator('[data-plane-poster]').isVisible());collectErrors=true;
      });
      await check('Chromium: toque não altera estado óptico',async()=>{
        const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();await ready(p);await scrollProgress(p,.5);const count=await p.evaluate(()=>window.__laminaContinuity.graphics.frames);await p.touchscreen.tap(170,600);await p.waitForTimeout(100);assert(await p.evaluate(()=>window.__laminaContinuity.graphics.frames)===count);await ctx.close();
      });
    }
    await check(`${engine}: sem JavaScript mantém conteúdo`,async()=>{
      const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await ctx.newPage();await p.goto(url+route);assert(await p.locator('h1').isVisible());assert(await p.locator('#services-title').isVisible());assert(await p.locator('[data-quote-noscript]').isVisible());assert(await p.locator('[name="servico"]').first().isDisabled());await ctx.close();
    });
    await check(`${engine}: descarte interrompe desenho`,async()=>{await ready(page);await page.evaluate(()=>window.__laminaContinuity.dispose());assert(await page.locator('canvas').count()===0);assert(await page.evaluate(()=>window.__laminaContinuity.motion)==='disposed');});
    await context.close();
  }catch(error){result.checks.push({name:`${engine}: inicialização/execução`,passed:false,error:error.message});console.log('ENGINE ERROR',engine,error.message);}finally{await browser?.close();}
}
result.summary={checks:result.checks.length,passed:result.checks.filter(c=>c.passed).length,failed:result.checks.filter(c=>!c.passed).length,normalErrors:result.normalErrors.length};
await writeFile(`${output}/testes.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary));
if(result.summary.failed||result.summary.normalErrors)process.exitCode=1;
