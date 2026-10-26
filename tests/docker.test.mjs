import test from 'node:test';
import assert from 'node:assert/strict';
import { judgeDocker } from '../server/docker-java.mjs';
test(
  'isolated Java compiler reports the bug, accepts a fix, and handles compilation errors',
  { skip: process.env.DEVQUEST_TEST_DOCKER !== '1', timeout: 60000 },
  async () => {
    assert.equal(
      (await judgeDocker('public static boolean canRegister(int age) { return age > 18; }', true))
        .passed,
      false,
    );
    assert.equal(
      (await judgeDocker('public static boolean canRegister(int age) { return age >= 18; }', true))
        .passed,
      true,
    );
    await assert.rejects(
      judgeDocker('public static boolean canRegister(int age) { return age + ; }', true),
    );
  },
);
