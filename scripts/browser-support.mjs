import { launch, baseURL } from "./browser.mjs";
import { writeFile } from "node:fs/promises";
const results = [];
for (const name of ["chromium", "firefox", "webkit"]) {
  let browser;
  try {
    browser = await launch(name, { timeout: 12000 });
    const page = await browser.newPage();
    const consoleErrors = [];
    const warnings = [];
    const exceptions = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
      if (message.type() === 'warning') warnings.push(message.text());
    });
    page.on('pageerror', error => exceptions.push(error.message));
    await page.goto(baseURL, { timeout: 15000 });
    await page.waitForTimeout(1400);
    results.push({
      name,
      version: browser.version(),
      title: await page.title(),
      graphics: await page.evaluate(() => window.__lamina?.surface),
      consoleErrors, warnings, exceptions,
      success: true,
    });
  } catch (error) {
    results.push({ name, success: false, error: error.message.slice(0, 1800) });
  } finally {
    await browser?.close();
  }
  console.log(JSON.stringify(results.at(-1)));
}
await writeFile(
  "docs/evidencias/navegadores.json",
  JSON.stringify(results, null, 2),
);
