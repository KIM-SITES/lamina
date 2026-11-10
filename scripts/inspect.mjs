import { mkdir, writeFile } from "node:fs/promises";
import { launch, baseURL } from "./browser.mjs";
await mkdir("docs/evidencias/revisao", { recursive: true });
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning")
    errors.push(message.text());
});
await page.goto(baseURL);
await page.waitForTimeout(2500);
await page.screenshot({ path: "docs/evidencias/revisao/desktop-inicial.png" });
await page.screenshot({
  path: "docs/evidencias/revisao/pagina-desktop.png",
  fullPage: true,
});
console.log(
  JSON.stringify(
    await page.evaluate(() => ({
      diagnostics: window.__lamina?.surface,
      progress: window.__lamina?.progress,
      width: document.documentElement.scrollWidth,
      source: document.querySelector("[data-surface-image]").currentSrc,
    })),
    null,
    2,
  ),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1200);
await page.screenshot({ path: "docs/evidencias/revisao/mobile-inicial.png" });
await page.screenshot({
  path: "docs/evidencias/revisao/pagina-mobile.png",
  fullPage: true,
});
console.log(JSON.stringify({ errors }, null, 2));
await writeFile(
  "docs/evidencias/revisao/console-inicial.json",
  JSON.stringify(errors, null, 2),
);
await browser.close();
