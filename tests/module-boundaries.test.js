import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('browser modules use repository-relative runtime imports', async () => {
  for (const path of ['ui/admin-section.js', 'ui/dashboard-element.js']) {
    const source = await readFile(path, 'utf8');
    assert.doesNotMatch(source, /from\s+['"]\/static\//);
  }
});

test('all locale bundles contain the same analytics keys', async () => {
  const locales = ['de', 'en', 'id', 'ja'];
  const keySets = await Promise.all(
    locales.map(async (locale) => {
      const xml = await readFile(`ui/languages/${locale}/strings.xml`, 'utf8');
      return [...xml.matchAll(/<string name="([^"]+)"/g)].map(
        (match) => match[1],
      );
    }),
  );
  for (const keys of keySets.slice(1)) assert.deepEqual(keys, keySets[0]);
});

test('admin dashboard uses the privacy-filter-safe summary route', async () => {
  const source = await readFile('ui/admin-section.js', 'utf8');
  assert.match(source, /\/analytics\/type-summary\?days=/);
  assert.doesNotMatch(source, /\/analytics\/event-summary\?days=/);
});
