import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(folder, entry.name)) : [path.join(folder, entry.name)]))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
let links = 0;
for (const file of files) assert.ok(!/\.(sql|php|env)$|(?:^|[/\\])\.env/.test(file), 'Private source in output: ' + file);
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'One heading expected: ' + file);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /href="#main"/);
  assert.ok(!/href="#"|mail\.php|staging\.minerbaone/.test(html), 'Placeholder or staging link: ' + file);
  const route = path.relative(root, file).split(path.sep).join('/');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g, '&');
    if (/^(?:https?:|mailto:|data:|\/\/)/.test(value)) continue;
    const url = new URL(value, 'https://local.example/' + route);
    const target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    assert.ok(target.startsWith(root + path.sep) || target === root, 'Link leaves output: ' + value);
    const resolved = url.pathname.endsWith('/') ? path.join(target, 'index.html') : target;
    await access(resolved).catch(() => { throw new Error('Broken link in ' + route + ': ' + value); });
    if (url.hash && resolved.endsWith('.html')) {
      const targetHtml = resolved === file ? html : await readFile(resolved, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(targetHtml.includes('id="' + id + '"'), 'Missing anchor: ' + value);
    }
    links++;
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image[0], /alt="/);
    assert.match(image[0], /width="\d+"/);
    assert.match(image[0], /height="\d+"/);
  }
}
assert.ok(htmlFiles.length >= 4, 'Core pages missing');
console.log('Verified ' + htmlFiles.length + ' HTML pages and ' + links + ' internal asset/link references.');
