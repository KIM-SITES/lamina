import { launch, baseURL } from './browser.mjs';
import { writeFile } from 'node:fs/promises';

const browser = await launch();
const page = await browser.newPage();
await page.goto(baseURL);
await page.waitForFunction(() => window.__lamina?.surface.mode === 'webgl');
const result = await page.evaluate(async () => {
  const range = document.querySelector('#surface-position');
  range.value = '80';
  range.dispatchEvent(new Event('input', { bubbles: true }));
  Object.defineProperty(document, 'hidden', { value: true, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  const before = window.__lamina.surface.frames;
  await new Promise(resolve => setTimeout(resolve, 200));
  const paused = { ...window.__lamina.surface };
  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    method: 'Simulação explícita de document.hidden e visibilitychange; não representa aba física oculta.',
    before, paused, resumed: { ...window.__lamina.surface },
    passed: paused.frames === before && paused.active === false,
  };
});
await writeFile('docs/evidencias/ciclo-aba-simulado.json', JSON.stringify(result, null, 2));
await browser.close();
console.log(`Pausa por evento simulado: ${result.passed ? 'aprovada' : 'falhou'}.`);
