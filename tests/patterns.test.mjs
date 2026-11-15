import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const patterns = (await readdir('.')).filter((file) => /^\d{2}_.*\.ts$/.test(file)).sort();

test('el catálogo contiene los diez patrones', () => assert.equal(patterns.length, 10));

for (const pattern of patterns) {
  test(`${pattern} se ejecuta sin errores`, () => {
    const output = execFileSync(process.execPath, ['--experimental-strip-types', pattern], { encoding: 'utf8' });
    assert.ok(output.trim().length > 0, 'el ejemplo debe producir una salida demostrable');
  });
}
