import { readFileSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const html = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
const scriptMatches = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
const script = scriptMatches.map(m => m[1]).join('\n');

test('static site has a complete document and accessible landmarks', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<main\b/);
  assert.match(html, /<svg\b/);
  assert.match(html, /<html[^>]+lang="en"/);
  for (const mode of ['archive', 'reflection', 'possibility']) {
    assert.match(html, new RegExp('data-mode="' + mode + '"'));
  }
});
test('the inline app script parses', () => {
  assert.equal(scriptMatches.length, 1);
  assert.doesNotThrow(() => new Script(script, { filename: 'site/index.html inline JS' }));
});
test('starter records keep their provenance categories distinct', () => {
  const sourceDeclaration = script.slice(0, script.indexOf('const KEY='));
  assert.ok(sourceDeclaration.includes('const SOURCE='));
  const records = runInNewContext(sourceDeclaration + '\nSOURCE');
  assert.ok(records.length >= 12);
  for (const mode of ['archive', 'reflection', 'possibility']) {
    assert.ok(records.some(r => r.mode === mode));
  }
  for (const record of records) {
    assert.ok(record.id && record.title && record.text);
    assert.ok(['archive', 'reflection', 'possibility'].includes(record.mode));
    if (record.mode === 'archive') {
      assert.match(record.url, /^https:\/\//);
      assert.ok(record.source);
    }
  }
});
test('the app does not introduce tracking or HTML injection', () => {
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+rel=["']stylesheet/i);
  assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|sendBeacon|eval)\s*\(/);
  assert.doesNotMatch(script, /\.innerHTML\s*=/);
  assert.match(script, /textContent/);
  assert.match(script, /localStorage/);
});
test('local entries support import, export, deletion and evidence boundaries', () => {
  for (const id of ['importBtn','exportBtn','clearBtn','saveBtn','newTitle','newText','network']) {
    assert.ok(html.includes('id="' + id + '"'), 'Missing control: ' + id);
  }
  assert.match(script, /AKASHA Open Archive/);
  assert.match(script, /safeRecord/);
  assert.match(script, /Documented entries require a source URL/);
  assert.match(script, /exportedAt/);
});
