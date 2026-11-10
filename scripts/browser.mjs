import { resolve } from "node:path";

process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve(".cache/ms-playwright");
const { chromium, firefox, webkit } = await import("@playwright/test");
export const baseURL = process.env.BASE_URL || "http://127.0.0.1:4321";
export const browsers = { chromium, firefox, webkit };
export async function launch(name = "chromium", options = {}) {
  return browsers[name].launch({ headless: true, ...(name === 'chromium' ? { channel: 'chromium' } : {}), ...options });
}
