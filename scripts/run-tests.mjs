import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { preview } from 'astro';
import { verifyAssets } from '../tests/assets.mjs';
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4322';
let server;
async function isReady() {
    try {
        return (await fetch(baseURL, { signal: AbortSignal.timeout(1000) })).ok;
    }
    catch {
        return false;
    }
}
try {
    await verifyAssets();
    if (!await isReady()) {
        const url = new URL(baseURL);
        if (!['127.0.0.1', 'localhost'].includes(url.hostname))
            throw Error('Inicie o servidor indicado em BASE_URL antes dos testes.');
        server = await preview({ server: { host: url.hostname, port: Number(url.port) || 4322 } });
    }
    const child = spawn(process.execPath, ['tests/site.mjs'], {
        stdio: 'inherit',
        env: { ...process.env, BASE_URL: baseURL, PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || resolve('.cache/ms-playwright') },
    });
    process.exitCode = await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', code => resolve(code ?? 1));
    });
}
catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
finally {
    await server?.stop();
}
