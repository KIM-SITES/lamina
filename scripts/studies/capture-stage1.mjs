import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import AxeBuilder from '@axe-core/playwright';
import { launch, baseURL } from '../browser.mjs';

const exec = promisify(execFile);
const output = 'docs/redirecao/etapa-1/evidencias';
const previews = 'public/studies/etapa-1/revisao';
await mkdir(output, { recursive: true });
await mkdir(previews, { recursive: true });
const path = '/estudos/etapa-1/';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet-horizontal', width: 1180, height: 820 },
  { name: 'compacto', width: 320, height: 700 },
];
const results = { date: '2026-11-10', baseURL, browser: '', baselineCommit: (await exec('git', ['rev-parse', 'HEAD'])).stdout.trim(), baselineTrackedChanges: (await exec('git', ['diff', '--name-only', 'HEAD'])).stdout.trim(), viewports: [], accessibility: [], functionality: [], consoleErrors: [], httpErrors: [], screenshots: [] };
const browser = await launch();
results.browser = `Chromium ${browser.version()}`;
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
const comparisonLabels = new Map();
page.on('pageerror', error => results.consoleErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') results.consoleErrors.push({ text: message.text(), location: message.location(), page: page.url() }); });
page.on('response', response => { if (response.status() >= 400) results.httpErrors.push({ url: response.url(), status: response.status(), page: page.url() }); });

async function prepare(url) {
  await page.goto(baseURL + url);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.images];
    for (const image of images) image.loading = 'eager';
    await Promise.all(images.map(image => image.decode().catch(() => undefined)));
  });
  await page.waitForTimeout(url === '/' ? 1400 : 100);
}
async function shot(name, options = {}) {
  const file = `${output}/${name}.png`;
  await page.screenshot({ path: file, animations: 'disabled', ...options });
  results.screenshots.push({ file, viewport: page.viewportSize(), fullPage: Boolean(options.fullPage), deviceScaleFactor: 1 });
  return file;
}

try {
  for (const viewport of viewports) {
    const { name, width, height } = viewport;
    await page.setViewportSize({ width, height });
    await prepare('/');
    await shot(`anterior-${name}`);
    for (const composition of ['a', 'b']) {
      await prepare(path + (composition === 'b' ? '?composicao=editorial' : ''));
      await shot(`${composition}-${name}`);
      if (composition === 'a' && ['desktop', 'tablet', 'mobile'].includes(name)) {
        await shot(`percurso-${name}`, { fullPage: true });
        for (const id of ['servicos', 'ambientes', 'orcamento']) {
          await page.evaluate(id => document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' }), id);
          await shot(`${id}-${name}`);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      }
      if (['desktop', 'tablet', 'mobile'].includes(name)) {
        const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;
        results.accessibility.push({ composition, viewport, violations: violations.map(v => ({ id: v.id, impact: v.impact, count: v.nodes.length, targets: v.nodes.map(n => n.target) })) });
      }
      results.viewports.push(await page.evaluate(({ name, composition }) => ({ name, composition, width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1, heroHeight: document.querySelector('.hero').getBoundingClientRect().height, selectedSource: document.querySelector('.hero img').currentSrc.split('/').pop(), brokenImages: [...document.images].filter(im => !im.complete || !im.naturalWidth).map(im => im.src), canvasCount: document.querySelectorAll('canvas').length }), { name, composition }));
      console.log(`Captured ${composition} ${name} ${width}x${height}`);
    }
  }
  for (const width of [375,430,600,699,700,768,1024,1280,1920]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : width < 900 ? 1100 : 900 });
    await prepare(path);
    results.viewports.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth + 1, source: document.querySelector('.hero img').currentSrc.split('/').pop(), titleWidth: document.querySelector('h1').getBoundingClientRect().width })));
    await shot(`largura-${width}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(path);
  await page.keyboard.press('Tab');
  results.functionality.push({ name: 'skip-link recebe primeiro foco visível', passed: await page.evaluate(() => document.activeElement?.classList.contains('skip-link') && getComputedStyle(document.activeElement).outlineStyle !== 'none') });
  await page.locator('[data-select-service="revitalizacao"]').click();
  results.functionality.push({ name: 'serviço pré-seleciona formulário', passed: await page.locator('[name="servico"][value="revitalizacao"]').isChecked() });
  await page.locator('[name="imovel"]').first().check();
  const outgoingWrites = [];
  page.on('request', request => { if (request.method() !== 'GET') outgoingWrites.push(request.url()); });
  await page.locator('[data-quote-submit]').click();
  results.functionality.push({ name: 'resumo local com aviso de não envio', passed: (await page.locator('[data-quote-result]').innerText()).includes('Nenhuma solicitação foi enviada') });
  await shot('resumo-mobile');
  await page.locator('[name="imovel"]').nth(1).check();
  results.functionality.push({ name: 'mudança limpa resumo anterior', passed: await page.locator('[data-quote-result]').textContent() === '' });
  results.functionality.push({ name: 'sem envio ou persistência', passed: outgoingWrites.length === 0 && await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0) });
  results.functionality.push({ name: 'destinos de âncora existentes', passed: await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(link.hash.slice(1)))) });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await prepare(path);
  results.functionality.push({ name: 'composição estática sob movimento reduzido', passed: await page.evaluate(() => document.getAnimations().length === 0 && document.querySelectorAll('canvas').length === 0) });
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.evaluate(() => document.documentElement.style.zoom = '2');
  results.functionality.push({ name: 'zoom CSS 200% sem overflow', passed: await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) });
  await shot('zoom-200');
  await page.evaluate(() => document.documentElement.style.zoom = '1');
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto(baseURL + path);
  results.functionality.push({ name: 'sem JavaScript: conteúdo e aviso disponíveis, envio desabilitado', passed: await noScriptPage.locator('h1').isVisible() && await noScriptPage.locator('[data-quote-noscript]').isVisible() && await noScriptPage.locator('input').first().isDisabled() });
  await noScriptPage.screenshot({ path: `${output}/sem-javascript.png` });
  await noScript.close();
  for (const { name, width } of viewports) {
    await page.setViewportSize({ width: width*2, height: 80 });
    await page.setContent(`<html><head><link rel="icon" href="/favicon.svg" type="image/svg+xml"></head><body style="margin:0;background:#123c3d;color:#f2f5ef;font:15px Arial;display:grid;grid-template-columns:1fr 1fr"><div style="padding:11px 18px">Anterior</div><div style="padding:11px 18px">Nova composição A</div></body></html>`);
    comparisonLabels.set(name, await page.screenshot({ clip: { x: 0, y: 0, width: width*2, height: 40 } }));
  }
} finally {
  await context.close();
  await browser.close();
}

// Compara capturas de igual viewport. Composição da prancha, sem alterar a captura.
for (const { name, width, height } of viewports) {
  const labelHeight = 40;
  await sharp({ create: { width: width*2, height: height+labelHeight, channels: 3, background: '#123c3d' } }).composite([{ input: comparisonLabels.get(name), left: 0, top: 0 }, { input: await readFile(`${output}/anterior-${name}.png`), left: 0, top: labelHeight }, { input: await readFile(`${output}/a-${name}.png`), left: width, top: labelHeight }]).png().toFile(`${output}/comparacao-${name}.png`);
  await sharp(`${output}/comparacao-${name}.png`).resize({ width: name === 'desktop' ? 1920 : width*2, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`${previews}/comparacao-${name}.webp`);
}
for (const composition of ['a','b']) await sharp(`${output}/${composition}-desktop.png`).resize(1152,720).webp({ quality: 86 }).toFile(`${previews}/${composition}-desktop.webp`);
await sharp(`${output}/percurso-desktop.png`).resize({ width: 720 }).webp({ quality: 87 }).toFile(`${previews}/percurso.webp`);
const failed = results.functionality.filter(check => !check.passed);
const violations = results.accessibility.reduce((sum, row) => sum+row.violations.length,0);
const overflow = results.viewports.filter(row => row.overflow);
results.summary = { screenshots: results.screenshots.length, functionalChecks: results.functionality.length, failedChecks: failed.length, axeViolations: violations, overflowingViewports: overflow.length, consoleErrors: results.consoleErrors.length };
await writeFile('docs/redirecao/etapa-1/validacao.json', JSON.stringify(results,null,2));
console.log(JSON.stringify(results.summary,null,2));
if (failed.length || violations || overflow.length || results.consoleErrors.length) process.exitCode = 1;
