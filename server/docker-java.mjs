import { chmod, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { SAMPLE_AGES, REVIEW_AGES } from './practice-java.mjs';

export async function judgeDocker(source, submit = false) {
  if (typeof source !== 'string' || source.length > 4000)
    throw new Error('Keep the method under 4,000 characters.');
  const directory = await mkdtemp(join(tmpdir(), 'devquest-java-'));
  const name = `devquest-${randomUUID()}`;
  const ages = [...SAMPLE_AGES, ...(submit ? REVIEW_AGES : [])];
  try {
    await chmod(directory, 0o755);
    await writeFile(
      join(directory, 'Registration.java'),
      `public class Registration {\n${source}\n}`,
    );
    await writeFile(
      join(directory, 'Harness.java'),
      `public class Harness { public static void main(String[] args) { int[] ages = {${ages.join(',')}}; for (int age : ages) { System.out.println("DEVQUEST_RESULT:" + age + ":" + Registration.canRegister(age)); } } }`,
    );
    const output = await new Promise((resolve, reject) => {
      const child = spawn(
        'docker',
        [
          'run',
          '--rm',
          '--pull=never',
          '--name',
          name,
          '--network=none',
          '--memory=256m',
          '--memory-swap=256m',
          '--cpus=0.5',
          '--pids-limit=64',
          '--read-only',
          '--cap-drop=ALL',
          '--security-opt=no-new-privileges',
          '--user=65534:65534',
          '--tmpfs=/tmp:rw,noexec,nosuid,size=32m',
          '--mount',
          `type=bind,source=${directory},target=/source,readonly`,
          'devquest-java:local',
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );
      let text = '',
        done = false;
      const finish = (error) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (error) reject(error);
        else resolve(text);
      };
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        finish(new Error('Java exceeded the 15-second limit. Check for an infinite loop.'));
      }, 15000);
      const collect = (chunk) => {
        text += chunk.toString();
        if (text.length > 12000) {
          child.kill('SIGKILL');
          finish(new Error('Java produced too much output.'));
        }
      };
      child.stdout.on('data', collect);
      child.stderr.on('data', collect);
      child.on('error', () =>
        finish(
          new Error(
            'Docker is unavailable. Start Docker and run npm run java:build, or use practice mode.',
          ),
        ),
      );
      child.on('close', (code) =>
        finish(code === 0 ? null : new Error(text.slice(-3000) || 'Java compilation failed.')),
      );
    });
    const values = String(output)
      .split('\n')
      .map((line) => line.match(/^DEVQUEST_RESULT:(-?\d+):(true|false)$/))
      .filter(Boolean);
    if (
      values.length !== ages.length ||
      values.some((match, index) => Number(match[1]) !== ages[index])
    )
      throw new Error('The method did not return a boolean for every test.');
    const tests = SAMPLE_AGES.map((age, index) => ({
      name: `Age ${age}`,
      input: age,
      expected: age >= 18,
      actual: values[index][2] === 'true',
    }));
    const reviewPassed = submit
      ? values.slice(3).every((match, i) => (match[2] === 'true') === REVIEW_AGES[i] >= 18)
      : null;
    return {
      tests,
      passed: tests.every((t) => t.actual === t.expected) && (!submit || reviewPassed),
      reviewPassed,
      runtime: 'docker',
    };
  } finally {
    // Killing the client alone does not guarantee that its container has stopped.
    await new Promise((resolve) => {
      const cleanup = spawn('docker', ['rm', '-f', name], { stdio: 'ignore', timeout: 5000 });
      cleanup.on('error', resolve);
      cleanup.on('close', resolve);
    });
    await rm(directory, { recursive: true, force: true });
  }
}
