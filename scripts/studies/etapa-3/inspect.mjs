import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { launch } from '../../browser.mjs';

const output = 'docs/redirecao/etapa-3/revisao-inicial';
await mkdir(output, { recursive: true });
const browser = await launch();
const results = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('PAGE ERROR', error.message));
  for (const [name, width, height] of [['desktop',1440,900],['tablet',820,1180],['mobile',390,844],['small',320,700]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4321/estudos/etapa-3/');
    await page.evaluate(async () => {
      await document.fonts.ready;
      [...document.images].forEach(image => image.loading = 'eager');
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    await page.waitForFunction(() => window.__laminaContinuity?.graphics.mode === 'webgl');
    for (const selector of ['#ambientes','#materiais','#processo','#orcamento','.closing']) {
      await page.locator(selector).evaluate(element => scrollTo(0, scrollY + element.getBoundingClientRect().top));
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${output}/${name}-${selector.replace(/[.#]/g,'')}.png` });
    }
    results.push(await page.evaluate(() => ({ width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,sections:[...document.querySelectorAll('main>section,footer.closing')].map(element=>({id:element.id||element.className,height:element.getBoundingClientRect().height})),broken:[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src) })));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => scrollTo(0,0));
    await page.waitForTimeout(160);
    const buffer = await page.screenshot({ path:`${output}/${name}-completa.png`,fullPage:true });
    await sharp(buffer).resize({width:width>700?600:390,withoutEnlargement:true}).png().toFile(`${output}/${name}-percurso.png`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    console.log('Inspecionado',name);
  }
} finally { await browser.close(); }
await writeFile(`${output}/layout.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
