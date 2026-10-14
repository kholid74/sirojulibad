import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../src/scripts/theme.js', import.meta.url), 'utf8');
function page({ saved, dark = false, blocked = false } = {}) {
  const root = { dataset: {} };
  let mounted = false;
  const listeners = {};
  const button = { hidden: true, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, addEventListener(name, callback) { listeners[name] = callback; } };
  const system = { matches: dark, addEventListener(name, callback) { listeners['system-' + name] = callback; } };
  const storage = { value: saved, getItem(key) { assert.equal(key, 'portfolio-theme'); if (blocked) throw new Error('Blocked'); return this.value; }, setItem(key, value) { assert.equal(key, 'portfolio-theme'); if (blocked) throw new Error('Blocked'); this.value = value; } };
  const document = { documentElement: root, readyState: 'loading', getElementById() { return mounted ? button : null; }, addEventListener(name, callback) { listeners[name] = callback; } };
  runInNewContext(script, { document, window: { localStorage: storage, matchMedia: () => system } });
  return { root, button, storage, mount() { mounted = true; listeners.DOMContentLoaded(); }, click() { listeners.click(); }, changeSystem(dark) { system.matches = dark; listeners['system-change'](); } };
}

test('theme applies before the button mounts and follows system changes until explicitly selected', () => {
  const p = page({ dark: true });
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.button.hidden, true);
  p.mount();
  assert.equal(p.button.hidden, false);
  assert.equal(p.button.attributes['aria-pressed'], 'true');
  p.changeSystem(false);
  assert.equal(p.root.dataset.theme, 'light');
  p.click();
  assert.equal(p.storage.value, 'dark');
  assert.equal(p.button.title, 'Switch to light mode');
  p.changeSystem(false);
  assert.equal(p.root.dataset.theme, 'dark');
  p.click();
  assert.equal(p.button.attributes['aria-pressed'], 'false');
  assert.equal(p.storage.value, 'light');
});

test('saved choice overrides system preference on another page; invalid saved values are ignored', () => {
  assert.equal(page({ saved: 'light', dark: true }).root.dataset.theme, 'light');
  assert.equal(page({ saved: 'dark', dark: false }).root.dataset.theme, 'dark');
  assert.equal(page({ saved: 'unexpected', dark: true }).root.dataset.theme, 'dark');
});

test('blocked storage still allows the toggle and retains the choice on the current page', () => {
  const p = page({ blocked: true, dark: false });
  p.mount();
  p.click();
  assert.equal(p.root.dataset.theme, 'dark');
  p.changeSystem(false);
  assert.equal(p.root.dataset.theme, 'dark');
  p.click();
  assert.equal(p.root.dataset.theme, 'light');
});

test('theme text and action colors meet 4.5:1 contrast on their surfaces', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  const tokens = rule => Object.fromEntries([...rule.matchAll(/--([a-z-]+):(#[a-f\d]{3,6});/g)].map(match => [match[1], match[2]]));
  const light = tokens(css.match(/:root\{([^}]+)\}/)[1]);
  const dark = { ...light, ...tokens(css.match(/:root\[data-theme="dark"\]\{([^}]+)\}/)[1]) };
  const luminance = color => {
    if (color.length === 4) color = '#' + [...color.slice(1)].map(c => c + c).join('');
    const channels = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const palette of [light, dark]) {
    for (const foreground of ['ink', 'muted', 'accent']) {
      for (const background of ['canvas', 'surface']) assert.ok(contrast(palette[foreground], palette[background]) >= 4.5, foreground + ' on ' + background);
    }
    assert.ok(contrast('#ffffff', palette.button) >= 4.5, 'Button text');
    assert.ok(contrast('#ffffff', palette['button-hover']) >= 4.5, 'Button hover text');
  }
});
