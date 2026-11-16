import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
export async function verifyAssets() {
    const root = resolve('dist');
    const html = await readFile(resolve(root, 'index.html'), 'utf8');
    const references = new Set();
    for (const match of html.matchAll(/(?:src|href|content)="(\/(?!\/)[^"#]+)"/g))
        references.add(match[1]);
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
        for (const item of match[1].split(','))
            references.add(item.trim().split(/\s+/)[0]);
    }
    const visited = new Set();
    async function verify(url, base = root) {
        if (!url || /^(?:data:|https?:|#)/.test(url))
            return;
        const path = resolve(base, url.replace(/^\//, '').split(/[?#]/)[0]);
        assert(path.startsWith(root + sep), `Recurso fora do build: ${url}`);
        if (visited.has(path))
            return;
        visited.add(path);
        assert((await stat(path)).isFile(), `Recurso ausente: ${url}`);
        if (path.endsWith('.css')) {
            const css = await readFile(path, 'utf8');
            for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
                await verify(match[1], match[1].startsWith('/') ? root : dirname(path));
        }
        if (path.endsWith('.js')) {
            const js = await readFile(path, 'utf8');
            for (const match of js.matchAll(/(?:from\s*|import\s*\()\s*["'\x60](\.[^"'\x60]+)["'\x60]/g))
                await verify(match[1], dirname(path));
        }
    }
    for (const url of references)
        await verify(url);
    const images = [...visited].filter(path => path.endsWith('.webp'));
    assert.equal(images.length, 19, 'As 19 variantes responsivas devem estar referenciadas.');
    assert.equal((await readdir('public/images')).length, images.length, 'Asset público sem referência.');
    assert(!html.includes('/studies/') && !html.includes('/estudos/'), 'Referência a estudos substituídos.');
    async function htmlFiles(dir) {
        const found = [];
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const path = resolve(dir, entry.name);
            if (entry.isDirectory())
                found.push(...await htmlFiles(path));
            else if (path.endsWith('.html'))
                found.push(path);
        }
        return found;
    }
    assert.deepEqual(await htmlFiles(root), [resolve(root, 'index.html')], 'O build deve conter somente a rota final.');
    console.log(`PASS integridade do build: ${visited.size} recursos, 19 imagens e uma página`);
}
