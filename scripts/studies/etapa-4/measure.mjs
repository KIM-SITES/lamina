import { readFile, writeFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve, relative } from 'node:path';
import { launch } from '../../browser.mjs';

const root='docs/redirecao/etapa-4';
const base=process.env.BASE_URL||'http://127.0.0.1:4322';
const html=await readFile('dist/estudos/etapa-4/index.html','utf8');
const visited=new Set();
async function module(path){
  path=resolve(path);if(visited.has(path))return;visited.add(path);
  const source=await readFile(path,'utf8');
  for(const match of source.matchAll(/["'\x60](?:\.\/|_astro\/)?([\w.-]+\.js)["'\x60]/g))await module(resolve(path,'..',match[1]));
}
for(const match of html.matchAll(/<script[^>]+src="(\/_astro\/[^"?]+\.js)"/g))await module(`dist${match[1]}`);
const javascript=await Promise.all([...visited].map(async path=>{const data=await readFile(path);return{path:relative(resolve('dist'),path).replaceAll('\\','/'),bytes:data.length,gzip:gzipSync(data).length};}));
const styles=[];
for(const match of html.matchAll(/<link[^>]+href="(\/_astro\/[^"?]+\.css)"/g)){const data=await readFile(`dist${match[1]}`);styles.push({path:match[1],bytes:data.length,gzip:gzipSync(data).length});}
const images=[];
for(const name of await readdir('public/studies/etapa-3/images')){const buffer=await readFile(`public/studies/etapa-3/images/${name}`);images.push({name,bytes:buffer.length});}
const totals={javascript:javascript.reduce((n,f)=>n+f.bytes,0),javascriptGzip:javascript.reduce((n,f)=>n+f.gzip,0),css:styles.reduce((n,f)=>n+f.bytes,0),cssGzip:styles.reduce((n,f)=>n+f.gzip,0),imageVariants:images.length,imageVariantsBytes:images.reduce((n,f)=>n+f.bytes,0)};
const report={date:'2026-11-11',url:base+'/estudos/etapa-4/',javascript,styles,images,totals,loads:[],raf:{},notes:['Build de produção local, sem throttling de CPU ou rede. Não são métricas de campo.','Soma gzip por módulo alcançável, incluindo imports dinâmicos. Imagens, fontes, cabeçalhos e galeria de evidências são contados separadamente.','Amostras rAF não medem FPS realmente apresentado nem tempo de GPU. Dispositivo móvel é emulado no computador.']};
const browser=await launch();
try{
  for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
    const page=await context.newPage();
    await page.addInitScript(()=>{
      window.__stage3Perf={lcp:0,cls:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.__stage3Perf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__stage3Perf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    });
    await page.goto(report.url);await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');await page.waitForTimeout(1000);
    const initial=await page.evaluate(()=>({lcp:window.__stage3Perf.lcp,cls:window.__stage3Perf.cls,resources:performance.getEntriesByType('resource').map(e=>({name:new URL(e.name).pathname,type:e.initiatorType,transferSize:e.transferSize,decodedBodySize:e.decodedBodySize})),hero:document.querySelector('[data-scene-source]').currentSrc}));
    for(const selector of ['#ambientes','#materiais','#processo','#orcamento','.closing']){await page.locator(selector).evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top));await page.waitForTimeout(200);}
    const final=await page.evaluate(()=>({cls:window.__stage3Perf.cls,resources:performance.getEntriesByType('resource').length}));report.loads.push({name,viewport:{width,height},initial,afterScroll:final});
    await context.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(report.url);await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
  report.raf=await page.evaluate(async()=>{
    const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),extension=gl.getExtension('WEBGL_debug_renderer_info');const intervals=[];
    const h=document.querySelector('.hero').offsetHeight;let previous=performance.now();
    for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const now=performance.now();intervals.push(now-previous);previous=now;scrollTo(0,h*.95*i/89);}
    intervals.sort((a,b)=>a-b);return{gpu:extension?gl.getParameter(extension.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),samples:intervals.length,median:intervals[45],p95:intervals[85],graphics:window.__laminaContinuity.graphics};
  });
}finally{await browser.close();}
await writeFile(`${root}/desempenho.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({totals,loads:report.loads.map(l=>({name:l.name,lcp:l.initial.lcp,cls:l.afterScroll.cls})),raf:report.raf},null,2));
