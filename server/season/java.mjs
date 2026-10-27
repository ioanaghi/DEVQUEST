import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, rm, access, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TASKS } from '../../src/lib/season-content.mjs';
import { MODELS, HELPERS, taskCases, growthCases, customCases } from './cases.mjs';
const bundled = fileURLToPath(new URL('../../java-runtime', import.meta.url));
export async function javaHome() {
  async function supported(home) {
    if (!home) return false;
    try {
      await access(join(home, 'bin', 'javac'));
      const release = await readFile(join(home, 'release'), 'utf8');
      const version = Number(release.match(/JAVA_VERSION="(\d+)/)?.[1]);
      return version >= 17 && version <= 23;
    } catch {
      return false;
    }
  }
  // An installed app never consults the host Java installation when its runtime is present.
  for (const home of [process.env.DEVQUEST_JAVA_HOME, bundled, process.env.JAVA_HOME]) {
    if (await supported(home)) return home;
  }
  if (process.platform === 'darwin')
    for (const version of [21, 17]) {
      const home = spawnSync('/usr/libexec/java_home', ['-v', String(version)], {
        encoding: 'utf8',
        timeout: 2000,
      }).stdout?.trim();
      if (await supported(home)) return home;
    }
  throw new Error(
    'Season 1 requires the bundled Java runtime. Rebuild the desktop application or set DEVQUEST_JAVA_HOME to a JDK 17–23 installation.',
  );
}
function run(binary, args, cwd, timeout) {
  return new Promise((resolve, reject) => {
    const p = spawn(binary, args, {
      cwd,
      env: { PATH: '/usr/bin:/bin', LANG: 'en_US.UTF-8', HOME: cwd },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '',
      err = '',
      done = false;
    const finish = (error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (error) {
        p.kill('SIGKILL');
        reject(error);
      } else resolve({ code: p.exitCode, out, err });
    };
    const timer = setTimeout(
      () =>
        finish(
          new Error(
            'Java time limit reached. Check for a loop that does not advance or recursion without a base case.',
          ),
        ),
      timeout,
    );
    p.stdout.on('data', (b) => {
      out += b;
      if (out.length > 64000) finish(new Error('Output limit reached.'));
    });
    p.stderr.on('data', (b) => {
      err += b;
      if (err.length > 32000) finish(new Error('Diagnostic output limit reached.'));
    });
    p.once('error', finish);
    p.once('close', () => finish());
  });
}
// Tokenize strings/comments before instrumenting; no host eval, shell, or source regex execution.
export function instrument(code, task) {
  if (typeof code !== 'string' || code.length > 12000)
    throw new Error('Keep submissions under 12,000 characters.');
  if (/\\u|[^\x09\x0a\x0d\x20-\x7e]/.test(code))
    throw new Error(
      'Use ASCII Java source without Unicode escapes; strings may use ordinary Java escapes.',
    );
  const matches = [
    ...code.matchAll(
      /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_$][\w$]*|\d+|\S/g,
    ),
  ];
  const tokens = matches.filter((m) => !m[0].startsWith('//') && !m[0].startsWith('/*'));
  const identifiers = tokens.filter((m) => /^[A-Za-z_$]/.test(m[0])).map((m) => m[0]);
  const forbidden = new Set(
    'package import native synchronized transient volatile System Runtime Process ProcessBuilder Thread ThreadGroup Class ClassLoader SecurityManager Security Policy AccessController Method Field Constructor Module Meter Harness Student getClass forName invoke setAccessible getDeclaredField getDeclaredMethod reflection reflect java javax sun com jdk catch finally try throw throws assert main finalize wait notifyAll'.split(
      ' ',
    ),
  );
  if (identifiers.some((x) => forbidden.has(x) || x.startsWith('__') || x.includes('$')))
    throw new Error(
      'Use the supplied method/classes and java.util collections only. Files, network, processes, reflection, exceptions and runtime access are unavailable.',
    );
  if (
    ['sorted', 'gap', 'failing', 'insert', 'last', 'reverse', 'cycle', 'middle'].includes(task) &&
    identifiers.some((x) =>
      [
        'HashMap',
        'Map',
        'HashSet',
        'Set',
        'ArrayList',
        'List',
        'Deque',
        'ArrayDeque',
        'Stack',
        'TreeMap',
        'TreeSet',
        'Arrays',
        'Collections',
      ].includes(x),
    )
  )
    throw new Error(
      'This exercise requires constant extra space; use pointers/references rather than collections or sorting.',
    );
  if (['sorted', 'gap', 'failing', 'insert', 'last', 'reverse', 'cycle', 'middle'].includes(task)) {
    // These tasks only allocate the small result array, never growing storage or replacement nodes.
    for (let i = 0; i < tokens.length; i++)
      if (tokens[i][0] === 'new') {
        const tail = tokens
          .slice(i, i + 5)
          .map((m) => m[0])
          .join('');
        if (!/^newint\[\](?:\{|$)/.test(tail) && !/^newint\[[02]\]/.test(tail))
          throw new Error(
            'Only a two-index result or new int[0] may be allocated in this constant-space exercise.',
          );
      }
  }
  if (
    task === 'palindrome' &&
    identifiers.some((x) =>
      [
        'new',
        'replace',
        'replaceAll',
        'toCharArray',
        'StringBuilder',
        'StringBuffer',
        'substring',
        'subSequence',
        'chars',
        'codePoints',
        'split',
      ].includes(x),
    )
  )
    throw new Error(
      'Compare code points in place with Character.toLowerCase; do not allocate a normalized string.',
    );
  if (
    task === 'palindrome' &&
    tokens.some((m, i) => m[0] === 'toLowerCase' && tokens[i - 2]?.[0] !== 'Character')
  )
    throw new Error('Use Character.toLowerCase on individual characters.');
  const insertions = new Set();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i][0];
    if (t === 'do') throw new Error('Use for/while loops with braces in the instrumented editor.');
    if (['for', 'while'].includes(t)) {
      if (tokens[i + 1]?.[0] !== '(') throw new Error('Expected a loop condition.');
      let depth = 0,
        j = i + 1;
      for (; j < tokens.length; j++) {
        if (tokens[j][0] === '(') depth++;
        if (tokens[j][0] === ')' && !--depth) break;
      }
      if (tokens[j + 1]?.[0] !== '{')
        throw new Error('Put braces around every loop body so the operation meter can measure it.');
    }
    if (t === '{' && tokens[i - 1]?.[0] === ')') {
      // Anonymous classes are unnecessary for the supplied exercises; named classes keep metering explicit.
      let depth = 0,
        j = i - 1;
      for (; j >= 0; j--) {
        if (tokens[j][0] === ')') depth++;
        if (tokens[j][0] === '(' && !--depth) break;
      }
      if (tokens[j - 2]?.[0] === 'new')
        throw new Error('Use named strategy classes, rather than anonymous classes.');
      insertions.add(tokens[i].index + 1);
    }
  }
  let result = code;
  for (const at of [...insertions].sort((a, b) => b - a))
    result = result.slice(0, at) + ' Meter.tick(); ' + result.slice(at);
  return result;
}
function helpers(task) {
  return HELPERS.split('\n')
    .filter(
      (line) =>
        !/^static boolean (reverse|cycle|middle)\(/.test(line) ||
        line.startsWith(`static boolean ${task}(`),
    )
    .join('\n');
}
export async function judgeSeasonJava({ task, code, submit = false, custom = [] }) {
  if (!TASKS[task] || TASKS[task].sql) throw new Error('Unknown Java exercise.');
  const source = instrument(code, task),
    publicCases = taskCases(task),
    authored = customCases(task, custom);
  const hidden = submit ? taskCases(task, true) : [],
    growth = submit ? growthCases(task) : [];
  const cases = [...publicCases, ...authored, ...hidden, ...growth];
  const tests = cases
    .map(
      (c, i) =>
        `try { Meter.reset(); boolean ok=(${c.check}); System.out.println("${i}|"+ok+"|"+Meter.count+"|"); } catch(Throwable e) { System.out.println("${i}|false|"+Meter.count+"|"+java.util.Base64.getEncoder().encodeToString((e.getClass().getSimpleName()+": "+String.valueOf(e.getMessage())).getBytes(java.nio.charset.StandardCharsets.UTF_8))); }`,
    )
    .join('\n');
  const directory = await mkdtemp(join(tmpdir(), 'devquest-java-'));
  try {
    const home = await javaHome();
    await Promise.all([
      writeFile(
        join(directory, 'Student.java'),
        `import java.util.*;\npublic class Student {\n${MODELS}\n${source}\n}`,
      ),
      writeFile(
        join(directory, 'Meter.java'),
        'final class Meter { static long count; static void reset(){count=0;} static void tick(){if(++count>200000)throw new IllegalStateException("Operation limit reached");} }',
      ),
      writeFile(
        join(directory, 'Harness.java'),
        `import java.util.*;\npublic class Harness {\n${helpers(task)}\npublic static void main(String[] args) {${tests}}\n}`,
      ),
      writeFile(
        join(directory, 'empty.policy'),
        '// No application permissions: filesystem, sockets, process execution and reflection are denied.\ngrant {};\n',
      ),
    ]);
    const compiled = await run(
      join(home, 'bin', 'javac'),
      [
        '-J-Xmx96m',
        '-J-Xss1m',
        '-J-XX:ActiveProcessorCount=1',
        '-proc:none',
        '-encoding',
        'UTF-8',
        '--release',
        '17',
        'Student.java',
        'Meter.java',
        'Harness.java',
      ],
      directory,
      7000,
    );
    if (compiled.code !== 0)
      throw new Error(compiled.err.replaceAll(directory + '/', '').slice(0, 6000));
    const executed = await run(
      join(home, 'bin', 'java'),
      [
        '-Xmx64m',
        '-Xss1m',
        '-XX:ActiveProcessorCount=1',
        '-Djava.security.manager',
        '-Djava.security.policy==' + resolve(directory, 'empty.policy'),
        '-cp',
        directory,
        'Harness',
      ],
      directory,
      5000,
    );
    if (executed.code !== 0) throw new Error('Java runtime stopped: ' + executed.err.slice(-2000));
    const rows = executed.out
      .trim()
      .split('\n')
      .map((line) => {
        const [id, passed, ops, error] = line.split('|');
        return {
          id: Number(id),
          passed: passed === 'true',
          operations: Number(ops),
          error: error ? Buffer.from(error, 'base64').toString() : undefined,
        };
      });
    if (rows.length !== cases.length || rows.some((r, i) => r.id !== i))
      throw new Error('The runtime returned an incomplete assessment.');
    const publicCount = publicCases.length + authored.length;
    const testsResult = rows.slice(0, publicCount).map((r, i) => ({
      name: cases[i].name,
      input: cases[i].input,
      expected: cases[i].expected,
      passed: r.passed,
      operations: r.operations,
      error: r.error,
    }));
    const reviewPassed = submit
      ? rows.slice(publicCount, publicCount + hidden.length).every((r) => r.passed)
      : null;
    let efficiencyPassed = null;
    if (submit) {
      const g = rows.slice(publicCount + hidden.length);
      efficiencyPassed = g.every((r) => r.passed);
      for (let i = 0; i < g.length; i += 3)
        efficiencyPassed &&=
          g[i + 2].operations < 10000 &&
          (g[i + 2].operations + 1) / (g[i + 1].operations + 1) <
            (['failing', 'insert', 'last'].includes(task) ? 1.55 : 2.8);
    }
    return {
      tests: testsResult,
      reviewPassed,
      efficiencyPassed,
      passed: testsResult.every((t) => t.passed) && (!submit || (reviewPassed && efficiencyPassed)),
      runtime: 'restricted-java-17',
      assessment:
        'Functional tests, controlled operation-growth checks and exercise-specific allocation restrictions; not a general proof of complexity.',
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
