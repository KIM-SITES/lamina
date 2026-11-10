import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { launch } from '../browser.mjs';

const root='docs/redirecao/etapa-2/servicos';
if(existsSync(`${root}/anterior/manifesto.json`))throw Error('Captura anterior já preservada. Não sobrescrever a referência do redesign.');
for(const dir of ['anterior','alternativas','evidencias'])await mkdir(`${root}/${dir}`,{recursive:true});
const baseline={date:new Date().toISOString(),files:[],screenshots:[]};
for(const file of ['Story.astro','surface.css','continuity.ts','scene.ts','shaders.ts','ContinuityRenderer.ts']){
  const buffer=await readFile(`src/studies/etapa-2/${file}`);await writeFile(`${root}/anterior/${file}.txt`,buffer);
  baseline.files.push({path:`src/studies/etapa-2/${file}`,sha256:createHash('sha256').update(buffer).digest('hex')});
}
const css=`@font-face{font-family:Syne;src:url('../../../../../public/fonts/syne.woff2')}@font-face{font-family:Instrument;src:url('../../../../../public/fonts/instrument-sans.woff2')}*{box-sizing:border-box}body{margin:0;font-family:Instrument,Arial,sans-serif;background:#e9f9e7;color:#083c63}h1,h2,p,figure{margin:0}h1{font:500 clamp(55px,8.7vw,145px)/.94 Syne;letter-spacing:-.065em}h2{font-weight:400;font-size:38px;line-height:1.08;letter-spacing:-.045em}p{line-height:1.5}picture{display:block;width:100%;height:100%}img{display:block;width:100%;height:100%;object-fit:cover}.meta{font-size:13px;padding:20px 4.45vw;background:#083c63;color:#e9f9e7;display:flex;justify-content:space-between}.intro{font-size:19px;max-width:270px}.action{font-size:14px;display:flex;align-items:center;justify-content:space-between;min-height:48px;border-bottom:1px solid;margin-top:20px;max-width:330px}.service-text{max-width:340px;font-size:16px;margin-top:20px}.rows{padding:70px 4.45vw}.rows article{display:grid;grid-template-columns:1fr 1fr;gap:70px;padding:42px 0;border-top:1px solid #9dbcb5}.rows article>div{max-width:350px}.rows article:nth-child(2){margin-left:14vw}.rows article:nth-child(3){margin-left:28vw;grid-template-columns:1fr}.vertical{display:grid;grid-template-columns:44% 1fr;gap:8%;padding:70px 4.45vw}.vertical figure{height:1040px}.vertical h1{font-size:clamp(55px,6.3vw,105px)}.vertical .intro{margin-top:40px}.vertical article{margin-top:80px}.vertical article:last-child{margin-top:95px}.vertical article h2{font-size:32px}.panorama{background:#083c63;color:#e9f9e7;padding-top:65px}.panorama h1{padding-inline:4.45vw;position:relative;z-index:2;color:#f6d567}.panorama h1 span{display:block;text-align:right;margin-top:10px}.panorama figure{height:510px;margin-top:-40px}.panorama .intro{padding:30px 4.45vw;max-width:100%;font-size:19px;background:#16c7ad;color:#083c63}.panorama+.rows{background:#e9f9e7}.asymmetric{background:#083c63;color:#e9f9e7;position:relative;min-height:930px;padding:80px 4.45vw 60px}.asymmetric figure{position:absolute;top:240px;left:29%;right:0;height:610px}.asymmetric figure:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,60,99,.6),transparent 65%)}.asymmetric h1{position:relative;z-index:1;font-size:clamp(60px,9.3vw,150px);max-width:1100px}.asymmetric h1 span{display:block}.asymmetric .intro{position:relative;margin-top:70px;width:23%;max-width:270px;font-size:18px}.asymmetric .note{position:absolute;bottom:60px;left:4.45vw;color:#16c7ad;font-size:13px}.asymmetric+.rows{background:#e9f9e7}.asymmetric+.rows article:first-child{border:0}.asymmetric+.rows article:first-child .action{background:#16c7ad;padding-inline:18px;border:0}@media(max-width:699px){.meta{padding:18px 24px;gap:20px;font-size:11px}.vertical{padding:35px 24px;grid-template-columns:1fr;gap:30px}.vertical figure{height:470px;grid-row:2}.vertical h1{font-size:55px}.vertical article{margin-top:55px}.vertical .intro{margin-top:30px}.panorama{padding-top:40px}.panorama h1{font-size:51px;padding-inline:24px}.panorama h1 span{text-align:left;margin-top:8px}.panorama figure{height:440px;margin:30px 0 0 24px}.panorama .intro{padding:25px 24px;font-size:16px}.asymmetric{min-height:960px;padding:45px 24px 45px}.asymmetric h1{font-size:58px}.asymmetric figure{top:225px;left:17%;height:440px}.asymmetric .intro{width:auto;max-width:245px;font-size:17px;margin-top:520px}.asymmetric .note{bottom:25px;left:24px}.rows{padding:40px 24px}.rows article,.rows article:nth-child(3){display:block;margin-left:0;padding:35px 0}.rows h2{font-size:33px}.rows article>div{max-width:none}.rows article p{font-size:15px}.rows article:nth-child(2){margin-left:0}.rows .action{max-width:none}}`;
const image=`<picture><source media="(max-width:699px)" srcset="../../../../../public/studies/etapa-2/superficie-vertical.webp"><img src="../../../../../public/studies/etapa-1/superficie-desktop.webp" alt="Piscina, pavilhão e borda de pedra"></picture>`;
const serviceData=[['Projeto e construção','Arquitetura, materiais e execução para a piscina que você imagina.','Simular projeto e construção'],['Revitalização e reforma','Novos revestimentos, bordas e sistemas para a piscina que já existe.','Simular revitalização'],['Manutenção e tratamento','Água e equipamentos bem cuidados, em todas as estações.','Simular manutenção']];
const articles=serviceData.map(([title,description,action])=>`<article><h2>${title}</h2><div><p class="service-text">${description}</p><p class="action">${action}<span aria-hidden="true">↗</span></p></div></article>`).join('');
const alternatives=[
  {id:'vertical',name:'A · Coluna de água',body:`<main class="vertical"><figure>${image}</figure><div><h1>Da paisagem<br>ao detalhe.</h1><p class="intro">Uma piscina começa no espaço. E continua no cuidado.</p>${articles}</div></main>`},
  {id:'panorama',name:'B · Horizonte contínuo',body:`<main><div class="panorama"><h1>Da paisagem<span>ao detalhe.</span></h1><figure>${image}</figure><p class="intro">Uma piscina começa no espaço. E continua no cuidado.</p></div><div class="rows">${articles}</div></main>`},
  {id:'assimetrica',name:'C · A margem',body:`<main><div class="asymmetric"><figure>${image}</figure><h1>Da paisagem<span>ao detalhe.</span></h1><p class="intro">Uma piscina começa no espaço. E continua no cuidado.</p><p class="note">Projeto, renovação e cuidado.</p></div><div class="rows">${articles}</div></main>`},
];
for(const alt of alternatives)await writeFile(`${root}/alternativas/${alt.id}.html`,`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${alt.name} — Lâmina</title><style>${css}</style></head><body><header class="meta"><span>lâmina. · Estudo de composição</span><span>${alt.name}</span></header>${alt.body}</body></html>`);
const browser=await launch();
try{
  const context=await browser.newContext({deviceScaleFactor:1});const page=await context.newPage();
  for(const[name,width,height]of[['desktop',1440,900],['tablet',820,1180],['mobile',390,844]]){
    await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4321/estudos/etapa-2/');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.__laminaContinuity?.graphics.mode==='webgl');
    for(const[t,state]of[[0,'hero'],[.35,'inicio'],[.65,'passagem'],[1,'destino']]){await page.evaluate(t=>scrollTo(0,document.querySelector('.hero').getBoundingClientRect().height*(innerWidth<700?.9:.95)*t),t);await page.waitForTimeout(200);const path=`${root}/anterior/${name}-${state}.png`;await page.screenshot({path});baseline.screenshots.push(path);}
    await page.evaluate(()=>scrollTo(0,document.querySelector('.hero').getBoundingClientRect().height));await page.waitForTimeout(200);await page.screenshot({path:`${root}/anterior/${name}-servicos.png`});await page.locator('#servicos').screenshot({path:`${root}/anterior/${name}-secao-completa.png`});
  }
  for(const alt of alternatives){
    for(const[name,width,height]of[['desktop',1440,1250],['mobile',390,1300]]){
      await page.setViewportSize({width,height});await page.goto(pathToFileURL(resolve(`${root}/alternativas/${alt.id}.html`)).href);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
      await page.screenshot({path:`${root}/alternativas/${alt.id}-${name}.png`,fullPage:true});console.log('Estudo renderizado',alt.id,name);
    }
  }
  for(const name of ['desktop','mobile']){
    const width=name==='desktop'?480:260;const height=name==='desktop'?700:1000;
    const layers=[];for(const[alt,index]of alternatives.map((a,i)=>[a,i])){
      const resized=await sharp(`${root}/alternativas/${alt.id}-${name}.png`).resize({width}).png().toBuffer();const meta=await sharp(resized).metadata();
      const padded=meta.height<height?await sharp(resized).extend({bottom:height-meta.height,background:'#083c63'}).png().toBuffer():resized;
      layers.push({input:await sharp(padded).extract({left:0,top:0,width,height}).png().toBuffer(),left:index*width,top:0});
    }
    await sharp({create:{width:width*3,height,channels:3,background:'#083c63'}}).composite(layers).png().toFile(`${root}/alternativas/comparacao-${name}.png`);
  }
}finally{await browser.close();}
await writeFile(`${root}/anterior/manifesto.json`,JSON.stringify(baseline,null,2));

