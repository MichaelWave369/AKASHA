import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
const script = html.split('<script>')[1]?.split('</script>')[0] || '';
const start = script.indexOf('function safeRecord(');
const end = script.indexOf('function store(');
assert.ok(start > 0 && end > start);
const { safeRecord, normalizeRecord } = new Function(script.slice(start, end) + ';return {safeRecord,normalizeRecord};')();
const example = { id:'u-old123', title:'A connected thought', text:'Personal reflection', mode:'reflection', url:'' };

test('legacy v1 entries remain valid and normalize without edges', () => {
  assert.equal(safeRecord(example),true);
  assert.deepEqual(normalizeRecord(example).links,[]);
});

test('imports cannot impersonate curated records or supply executable links', () => {
  assert.equal(safeRecord({...example,id:'akasa'}),false);
  assert.equal(safeRecord({...example,url:'javascript:alert(1)'}),false);
  assert.equal(safeRecord({...example,title:''}),false);
  assert.equal(safeRecord({...example,text:''}),false);
  assert.equal(safeRecord({...example,source:'x'.repeat(161)}),false);
  assert.equal(safeRecord({...example,mode:'archive'}),false);
  assert.equal(safeRecord({...example,mode:'archive',url:'https://www.loc.gov/apis/'}),true);
});

test('custom relationships deduplicate, omit self-links and cap at eight', () => {
  const links = ['akasa','akasa',example.id,...Array.from({length:20},(_,i)=>'u-other-'+i)];
  assert.deepEqual(normalizeRecord({...example,links}).links,['akasa',...Array.from({length:7},(_,i)=>'u-other-'+i)]);
});

test('viewer exposes interactive connections, protects existing storage and exports v2', () => {
  for (const token of ['CONNECTED RECORDS','fillLinkPicker','newLink','newSource','links:r.links||[]','version:2','map(normalizeRecord)','const KEY=']) {
    assert.ok(html.includes(token),'missing '+token);
  }
  assert.ok(script.includes("const target=others.find(x=>x.id===pick.value)"));
  assert.ok(script.includes("entry.links=(entry.links||[]).filter"));
  assert.ok(script.includes("follow.addEventListener('click'"));
  assert.ok(script.includes("const KEY='akasha_open_archive_entries_v1'"));
});
