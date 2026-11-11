import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../../browser.mjs';

const exec = promisify(execFile);
const root = 'docs/redirecao/etapa-3';
const base = process.env.BASE_URL || 'http://127.0.0.1:4321';
const route = '/estudos/etapa-3/';
const output = { date:'2026-11-11', base, checks:[], browsers:[], errors:[], accessibility:[], layout:[] };
await mkdir(root, { recursive:true });
const assert = (condition, message='Condição não atendida') => { if (!condition) throw Error(message); };
let currentCheck='';
async function check(name, fn) {
  currentCheck=name;
  try { const detail = await fn(); output.checks.push({ name, passed:true, detail }); console.log('PASS',name); }
  catch (error) { output.checks.push({ name, passed:false, error:error.message }); console.log('FAIL',name,error.message); }
}
async function ready(page, query='') {
  await page.goto(base+route+query);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__laminaContinuity?.motion === 'scroll' || window.__laminaContinuity?.motion === 'reduced-motion');
  await page.waitForTimeout(240);
}
async function top(page, selector) {
  await page.locator(selector).evaluate(element => scrollTo(0, scrollY+element.getBoundingClientRect().top));
  await page.waitForTimeout(100);
}
const active = page => page.locator('[data-atmosphere-select][aria-pressed=true]').getAttribute('data-atmosphere-select');

await check('Histórico, AGENTS, Skills, renderer e simulação preservados', async () => {
  const changed=(await exec('git',['diff','--name-only','HEAD'])).stdout.trim();
  assert(!changed, 'Arquivo histórico modificado: '+changed);
  const original=await readFile('src/studies/etapa-2/Story.astro','utf8');
  const complete=await readFile('src/studies/etapa-3/components/Opening.astro','utf8');
  const hero=text=>text.slice(text.indexOf('<section class="hero"'),text.indexOf('</section>')+10).replaceAll('\r\n','\n').replace('/estudos/etapa-1/#ambientes','#ambientes');
  assert(hero(original)===hero(complete),'Hero alterado além da âncora local');
  return { historicalTrackedDiff:[], heroIdenticalExceptLocalAnchor:true };
});

for (const engine of (process.env.ENGINES||'chromium,firefox,webkit').split(',')) {
  let browser;
  try {
    browser=await launch(engine,{timeout:20000});
    output.browsers.push({engine,version:browser.version()});
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror',error=>{const detail={engine,check:currentCheck,url:page.url(),message:error.message};output.errors.push(detail);console.log('PAGE ERROR',JSON.stringify(detail));});

    await check(`${engine}: continuidade, reversão, destino e repouso`,async()=>{
      await ready(page);
      await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
      const h=await page.locator('.hero').evaluate(e=>e.getBoundingClientRect().height);
      await page.evaluate(y=>scrollTo(0,y),h*.95*.55);await page.waitForTimeout(130);
      const first=await page.evaluate(()=>({crop:window.__laminaContinuity.crop,frame:window.__laminaContinuity.frame}));
      await page.evaluate(y=>scrollTo(0,y),h*.95*.91);await page.waitForTimeout(100);
      await page.evaluate(y=>scrollTo(0,y),h*.95*.55);await page.waitForTimeout(130);
      const reverse=await page.evaluate(()=>({crop:window.__laminaContinuity.crop,frame:window.__laminaContinuity.frame}));
      assert(Math.abs(first.frame.y-reverse.frame.y)<2 && Math.abs(first.crop.x-reverse.crop.x)<.003,'Reversão inconsistente');
      await page.evaluate(y=>scrollTo(0,y),h);await page.waitForTimeout(180);
      const difference=await page.evaluate(()=>{const f=window.__laminaContinuity.frame,r=document.querySelector('[data-destination] picture').getBoundingClientRect();return Math.max(Math.abs(f.x-r.x),Math.abs(f.y-r.y),Math.abs(f.width-r.width),Math.abs(f.height-r.height));});
      assert(difference<1.5,'Destino desalinhado '+difference);
      await top(page,'#processo');
      const count=await page.evaluate(()=>window.__laminaContinuity.graphics.frames);await page.waitForTimeout(250);
      assert(count===await page.evaluate(()=>window.__laminaContinuity.graphics.frames),'Canvas desenhando fora da abertura');
      return {destinationError:difference,offscreenFrames:count};
    });

    await check(`${engine}: galeria por teclado, foco e URL`,async()=>{
      await ready(page);await top(page,'#ambientes');
      const first=page.locator('[data-atmosphere-select=luz]');await first.focus();
      await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('[data-atmosphere-select=jardim]').getAttribute('aria-pressed')==='true');
      assert(await active(page)==='jardim');
      const focus=await page.evaluate(()=>({id:document.activeElement.dataset.atmosphereSelect,outline:getComputedStyle(document.activeElement).outlineStyle}));
      assert(focus.id==='jardim'&&focus.outline!=='none',JSON.stringify(focus));
      assert(new URL(page.url()).searchParams.get('ambiente')==='jardim','Estado sem URL');
      assert(await page.locator('[data-atmosphere=jardim]').isVisible());
      assert(!await page.locator('[data-atmosphere=luz] a').isVisible(),'Conteúdo inativo exposto');
      await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('[data-atmosphere-select=noite]').getAttribute('aria-pressed')==='true');
      assert(await page.evaluate(()=>document.querySelector('.atmosphere-stage').getAnimations({subtree:true}).length)===0,'Teclado iniciou animação');
      await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('[data-atmosphere-select=luz]').getAttribute('aria-pressed')==='true');
      return focus;
    });

    await check(`${engine}: interrupção e seleção rápida conservam a última escolha`,async()=>{
      await page.evaluate(()=>{
        document.querySelector('[data-atmosphere-select=jardim]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));
        document.querySelector('[data-atmosphere-select=noite]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));
        document.querySelector('[data-atmosphere-select=jardim]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));
      });
      await page.waitForTimeout(850);
      assert(await active(page)==='jardim','Última escolha perdida');
      assert(await page.locator('[data-atmosphere]:visible').count()===1,'Painéis duplicados após animação');
      const panel=page.locator('[data-atmosphere=jardim]');
      assert(await panel.evaluate(e=>!e.inert && getComputedStyle(e).opacity==='1'),'Painel não interativo');
      await page.evaluate(()=>document.querySelector('[data-atmosphere-select=noite]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1})));
      await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
      assert(await page.locator('[data-atmosphere]:visible').count()===1,'Preferência durante animação deixou sobreposição');
      assert(await page.evaluate(()=>document.querySelector('.atmosphere-stage').getAnimations({subtree:true}).length)===0);
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');
      return {latestWins:true,preferenceInterrupts:true};
    });

    await check(`${engine}: formulário mantém pré-seleção e resumo sem rede ou persistência`,async()=>{
      await ready(page);
      const mutations=[];
      page.on('request',request=>{if(request.method()!=='GET')mutations.push({method:request.method(),url:request.url()});});
      for (const id of ['projeto','revitalizacao','manutencao']) {
        const link=page.locator(`.service [data-select-service=${id}]`);await link.focus();await page.keyboard.press('Enter');
        assert(await page.locator(`input[name=servico][value=${id}]`).isChecked(),'Pré-seleção '+id);
      }
      await page.getByLabel('Condomínio',{exact:true}).check();
      await page.locator('[data-quote-submit]').click();
      const result=await page.locator('[data-quote-result]').innerText();
      assert(result.includes('Manutenção e tratamento para condomínio.')&&result.includes('Nenhuma solicitação foi enviada.'),result);
      await page.locator('input[name=servico][value=projeto]').check();
      assert(!(await page.locator('[data-quote-result]').innerText()),'Resumo obsoleto');
      const persistence=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}));
      assert(!persistence.local&&!persistence.session&&!persistence.cookie,JSON.stringify(persistence));assert(!mutations.length,JSON.stringify(mutations));
      assert(await page.locator('input:not([type=radio])').count()===0,'Coleta fora do escopo');
      return {result,persistence,mutations};
    });

    await check(`${engine}: materiais nativos por teclado e links locais`,async()=>{
      const summary=page.locator('.material-notes summary').nth(1);await summary.focus();await page.keyboard.press('Enter');
      assert(await summary.evaluate(e=>e.parentElement.open),'Disclosure não abre');
      await page.keyboard.press('Enter');assert(!await summary.evaluate(e=>e.parentElement.open));
      const missing=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
      assert(!missing.length,JSON.stringify(missing));return {missing};
    });

    if(engine==='chromium') {
      for(const width of [320,375,390,430,768,820,1024,1280,1440,1920]) {
        await check(`${width}px: percurso completo, galeria e áreas de toque`,async()=>{
          const height=width<700?844:width<900?1180:900;await page.setViewportSize({width,height});await ready(page);
          const states=[];
          for(const selector of ['.hero','#servicos','#ambientes','#materiais','#processo','#orcamento','.closing','.closing-meta']) {
            await top(page,selector);
            const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('h1,h2,h3,legend,main>section p,.closing p,button,summary,a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>1&&r.height>1&&getComputedStyle(e).visibility!=='hidden'&&(r.left<-.5||r.right>innerWidth+.5)}).map(e=>({tag:e.tagName,text:e.textContent.slice(0,70),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))}));
            assert(geometry.scrollWidth<=width+1&&geometry.overflow.length===0,JSON.stringify({selector,...geometry}));states.push(selector);
          }
          const heights=[];
          for(const id of ['luz','jardim','noite']) {
            await page.locator(`[data-atmosphere-select=${id}]`).evaluate(e=>e.click());await page.waitForTimeout(100);
            const g=await page.locator('.atmosphere-stage').boundingBox();heights.push(g.height);
            assert(await active(page)===id,'Seleção '+id);
          }
          const controls=await page.locator('[data-gallery-controls] button,.material-notes summary,.closing-meta a').evaluateAll(elements=>elements.filter(e=>e.getBoundingClientRect().height<44).map(e=>({text:e.textContent,height:e.getBoundingClientRect().height})));
          assert(!controls.length,JSON.stringify(controls));
          output.layout.push({width,height,states,galleryHeights:heights});
          return {states:states.length,overflow:0,controlsUnder44:0,galleryHeights:heights};
        });
      }
      for(const [name,width,height] of [['mobile',390,844],['tablet',820,1180],['desktop',1440,900]]) {
        await check(`${name}: axe A/AA no percurso e nas três atmosferas`,async()=>{
          await page.setViewportSize({width,height});await ready(page);
          const records=[];
          for(const selector of ['.hero','#servicos','#materiais','#processo','#orcamento','.closing']) {
            await top(page,selector);const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
            records.push({state:selector,violations});
          }
          await top(page,'#ambientes');
          for(const id of ['luz','jardim','noite']) {
            await page.locator(`[data-atmosphere-select=${id}]`).evaluate(e=>e.click());await page.waitForTimeout(120);
            const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
            records.push({state:id,violations});
          }
          output.accessibility.push({name,width,records});assert(records.every(r=>!r.violations.length),JSON.stringify(records.filter(r=>r.violations.length)));return {states:records.length,violations:0};
        });
      }
      await check('Zoom 200%, reorientação e leitura ampliada',async()=>{
        await page.setViewportSize({width:820,height:1180});await ready(page);await page.evaluate(()=>document.documentElement.style.zoom='2');await page.waitForTimeout(160);
        for(const selector of ['#ambientes','#materiais','#processo','#orcamento','.closing']) {await top(page,selector);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow 200% '+selector);}
        await page.evaluate(()=>document.documentElement.style.removeProperty('zoom'));
        await page.setViewportSize({width:1180,height:820});await page.waitForTimeout(180);await top(page,'#ambientes');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));return {cssZoom:2,landscape:'1180x820',nativeBrowserZoom:false};
      });
      await check('Toque: seleção, navegação e resumo em 390px',async()=>{
        const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await touch.newPage();await ready(p);
        await p.locator('[data-atmosphere-select=jardim]').tap();await p.waitForTimeout(680);assert(await active(p)==='jardim');
        await p.locator('[data-gallery-next]').tap();await p.waitForTimeout(680);assert(await active(p)==='noite');
        await p.locator('[data-atmosphere=noite] [data-select-service]').tap();assert(await p.locator('input[value=projeto]').isChecked());
        await p.getByLabel('Residência',{exact:true}).tap();await p.locator('[data-quote-submit]').tap();assert((await p.locator('[data-quote-result]').innerText()).includes('residência'));
        await touch.close();return {touch:true,simulated:true};
      });
    }

    await check(`${engine}: movimento reduzido e fallback gráfico preservam conteúdo`,async()=>{
      await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await ready(page,'?ambiente=noite');
      assert(await active(page)==='noite');assert(await page.evaluate(()=>window.__laminaContinuity.motion)==='reduced-motion');
      assert(await page.locator('canvas').count()===0,'Canvas no movimento reduzido');
      await page.locator('[data-atmosphere-select=jardim]').click();await page.waitForTimeout(100);assert(await active(page)==='jardim');
      assert(await page.evaluate(()=>document.querySelector('.atmosphere-stage').getAnimations({subtree:true}).length)===0);
      await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='webgl');await ready(page,'?grafico=fallback');
      await page.waitForFunction(()=>window.__laminaContinuity.graphics.mode==='fallback');
      assert(await page.locator('#services-title').isVisible());await top(page,'#ambientes');assert(await page.locator('[data-atmosphere=luz] img').isVisible());
      return {reduced:true,fallback:true};
    });
    await check(`${engine}: sem JavaScript todos os ambientes e conteúdo estão acessíveis`,async()=>{
      const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await nojs.newPage();await p.goto(base+route);
      assert(await p.locator('[data-atmosphere]:visible').count()===3,'Ambientes escondidos');assert(await p.locator('[data-gallery-controls]:visible').count()===0,'Controles inoperantes expostos');
      assert(await p.locator('[data-quote-noscript]').isVisible());assert(await p.locator('[data-quote-submit]').isHidden());assert(await p.locator('canvas').count()===0);
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow sem JS');await nojs.close();return {visibleEnvironments:3,quoteLimitation:true};
    });
    await context.close();
  } catch(error) { output.checks.push({name:`${engine}: execução`,passed:false,error:error.message});console.log('FAIL',engine,error.message); }
  finally { await browser?.close(); }
}

await check('Rotas novas, históricas e documentação respondem 200',async()=>{
  const results=[];
  for(const path of ['/','/estudos/','/estudos/etapa-1/','/estudos/etapa-2/','/estudos/etapa-2/revisao/',route,route+'revisao/']) {const response=await fetch(base+path);results.push({path,status:response.status});}
  assert(results.every(r=>r.status===200),JSON.stringify(results));return results;
});
output.summary={checks:output.checks.length,passed:output.checks.filter(r=>r.passed).length,failed:output.checks.filter(r=>!r.passed).length,pageErrors:output.errors.length};
await writeFile(`${root}/testes.json`,JSON.stringify(output,null,2));console.log(JSON.stringify(output.summary));if(output.summary.failed||output.errors.length)process.exitCode=1;
