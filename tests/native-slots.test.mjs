import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
test(
  'native slot store persists, reloads, resets and preserves legacy/corrupt files',
  { skip: process.platform !== 'darwin' },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), 'devquest-slot-test-'));
    try {
      const cache = resolve('.build/swift-cache');
      await mkdir(cache, { recursive: true });
      const binary = join(directory, 'slot-store-test');
      const compile = spawnSync(
        'xcrun',
        [
          'swiftc',
          '-swift-version',
          '5',
          '-module-cache-path',
          cache,
          'desktop/SaveLibraryStore.swift',
          'tests/native-slots.swift',
          '-o',
          binary,
        ],
        { encoding: 'utf8', timeout: 30000 },
      );
      assert.equal(compile.status, 0, compile.stderr);
      const run = spawnSync(binary, [join(directory, 'data')], {
        encoding: 'utf8',
        timeout: 10000,
      });
      assert.equal(run.status, 0, run.stderr);
      assert.match(run.stdout, /Native atomic save slots passed/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
