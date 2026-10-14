import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../src/scripts/navigation.js', import.meta.url), 'utf8');
function page(isMobile = true) {
  const documentListeners = {};
  let document;
  class Element {
    constructor(name) { this.name = name; this.attributes = {}; this.listeners = {}; this.hidden = false; }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key]; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    closest(selector) { return this.name === 'link' && selector === 'a' ? this : null; }
    focus() { document.activeElement = this; }
  }
  const button = new Element('button');
  const nav = new Element('nav');
  const link = new Element('link');
  const theme = new Element('theme');
  const header = new Element('header');
  const outside = new Element('outside');
  nav.contains = node => node === nav || node === link;
  nav.querySelector = () => link;
  header.contains = node => [header, button, nav, link, theme].includes(node);
  const media = { matches: isMobile, addEventListener(name, callback) { assert.equal(name, 'change'); this.listener = callback; } };
  document = { activeElement: null, querySelector: () => header, getElementById: id => id === 'menu-toggle' ? button : nav, addEventListener(name, callback) { documentListeners[name] = callback; } };
  runInNewContext(script, { document, Element, window: { matchMedia(query) { assert.equal(query, '(max-width: 700px)'); return media; } } });
  return { button, nav, link, theme, outside, header, document,
    click() { button.listeners.click(); },
    escape() { documentListeners.keydown({ key: 'Escape' }); },
    outsideClick() { documentListeners.click({ target: outside }); },
    resize(mobile) { media.matches = mobile; media.listener(); }
  };
}

test('mobile disclosure opens and Escape closes it with focus restored', () => {
  const p = page();
  assert.equal(p.nav.hidden, true);
  assert.equal(p.button.hidden, false);
  assert.equal(p.button.getAttribute('aria-expanded'), 'false');
  p.click();
  assert.equal(p.nav.hidden, false);
  assert.equal(p.button.getAttribute('aria-label'), 'Close navigation');
  p.link.focus();
  p.escape();
  assert.equal(p.nav.hidden, true);
  assert.equal(p.button.getAttribute('aria-expanded'), 'false');
  assert.equal(p.document.activeElement, p.button);
});

test('navigation selection, outside click and tabbing out close the menu', () => {
  const p = page();
  p.click();
  p.nav.listeners.click({ target: p.link });
  assert.equal(p.nav.hidden, true);
  assert.equal(p.document.activeElement, p.button);
  p.click();
  p.link.focus();
  p.outsideClick();
  assert.equal(p.nav.hidden, true);
  assert.equal(p.document.activeElement, p.button);
  p.click();
  p.header.listeners.focusout({ relatedTarget: p.theme });
  assert.equal(p.nav.hidden, false);
  p.header.listeners.focusout({ relatedTarget: p.outside });
  assert.equal(p.nav.hidden, true);
});

test('desktop always exposes navigation and breakpoint changes avoid hidden focus', () => {
  const p = page(false);
  assert.equal(p.nav.hidden, false);
  assert.equal(p.button.hidden, true);
  p.link.focus();
  p.resize(true);
  assert.equal(p.nav.hidden, true);
  assert.equal(p.document.activeElement, p.button);
  p.resize(false);
  assert.equal(p.nav.hidden, false);
  assert.equal(p.button.hidden, true);
  assert.equal(p.document.activeElement, p.link);
  p.resize(true);
  p.click();
  p.resize(false);
  p.resize(true);
  assert.equal(p.nav.hidden, true);
  assert.equal(p.button.getAttribute('aria-expanded'), 'false');
});
