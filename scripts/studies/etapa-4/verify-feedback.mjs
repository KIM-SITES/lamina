import { writeFile } from 'node:fs/promises';
import { launch } from '../../browser.mjs';
const base=process.env.BASE_URL||'http://127.0.0.1:4322',result={checks:[]};
for(const engine of ['chromium','firefox','webkit']){
  let browser,release;
  try{
    browser=await launch(engine);const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
    const gate=new Promise(resolve=>release=resolve);await page.route('**/jardim-adentro-*.webp',async route=>{await gate;await route.continue();});
    await page.goto(base+'/estudos/etapa-4/');await page.locator('[data-atmosphere-select=jardim]').click();
    await page.waitForFunction(()=>document.querySelector('[data-gallery-status]').textContent.includes('Carregando Jardim adentro'));
    const detail=await page.evaluate(()=>{const status=document.querySelector('[data-gallery-status]'),visual=document.querySelector('[data-gallery-feedback]');return{live:status.getAttribute('aria-live'),insideBusy:!!status.closest('[aria-busy=true]'),text:status.textContent,visualVisible:!visual.hidden,visualHiddenToAT:visual.getAttribute('aria-hidden')==='true'};});
    if(detail.live!=='polite'||detail.insideBusy||!detail.visualVisible||!detail.visualHiddenToAT)throw Error(JSON.stringify(detail));
    release();await page.waitForFunction(()=>document.querySelector('[data-atmosphere-select=jardim]').getAttribute('aria-pressed')==='true');
    await page.waitForFunction(()=>document.querySelector('[data-gallery-status]').textContent.includes('Jardim adentro, 2 de 3'));
    result.checks.push({engine,passed:true,detail});console.log('PASS',engine,'aviso acessível fora de aria-busy');
  }catch(error){result.checks.push({engine,passed:false,error:error.message});console.log('FAIL',engine,error.message);}
  finally{release?.();await browser?.close();}
}
result.summary={checks:result.checks.length,passed:result.checks.filter(c=>c.passed).length,failed:result.checks.filter(c=>!c.passed).length};
await writeFile('docs/redirecao/etapa-4/feedback.json',JSON.stringify(result,null,2));if(result.summary.failed)process.exitCode=1;
