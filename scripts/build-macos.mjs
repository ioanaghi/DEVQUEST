import { javaHome } from '../server/season/java.mjs';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile, open } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (process.platform !== 'darwin')
  throw new Error('The macOS app must be built on macOS with Xcode Command Line Tools.');
const binary = process.env.DEVQUEST_NODE_BINARY || process.execPath;
const license = process.env.DEVQUEST_NODE_LICENSE || resolve(dirname(binary), '../LICENSE');
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: 'inherit' });
const linked = execFileSync('otool', ['-L', binary], { encoding: 'utf8' });
if (
  linked
    .split('\n')
    .slice(1)
    .some(
      (line) =>
        line.trim() &&
        !line.trim().startsWith('/usr/lib/') &&
        !line.trim().startsWith('/System/Library/'),
    )
)
  throw new Error(
    'Use an official self-contained Node.js binary. Set DEVQUEST_NODE_BINARY and DEVQUEST_NODE_LICENSE to an extracted Node.js macOS distribution. Homebrew binaries need external libraries.',
  );
const runtimeMinimum =
  execFileSync('otool', ['-l', binary], { encoding: 'utf8' }).match(/\bminos\s+([\d.]+)/)?.[1] ??
  '13.5';
const versionNumber = (value) =>
  value.split('.').reduce((sum, part, index) => sum + Number(part) / 100 ** index, 0);
const minimumOS = versionNumber(runtimeMinimum) > versionNumber('13.5') ? runtimeMinimum : '13.5';
await stat(license);
execFileSync(
  binary,
  ['-e', 'const {DatabaseSync}=require("node:sqlite");new DatabaseSync(":memory:").close()'],
  { stdio: 'ignore' },
);
run(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit']);
run(process.execPath, ['node_modules/vite/bin/vite.js', 'build']);
const release = join(root, 'release'),
  staging = await mkdtemp(join(tmpdir(), 'devquest-macos-')),
  app = join(staging, 'DEVQUEST.app'),
  contents = join(app, 'Contents');
const cache = join(root, '.build', 'swift-cache');
await mkdir(cache, { recursive: true });
await mkdir(release, { recursive: true });
await mkdir(join(contents, 'MacOS'), { recursive: true });
await mkdir(join(contents, 'Resources', 'runtime'), { recursive: true });
await cp(join(root, 'desktop', 'Info.plist'), join(contents, 'Info.plist'));
const plist = await readFile(join(contents, 'Info.plist'), 'utf8');
await writeFile(
  join(contents, 'Info.plist'),
  plist.replace(
    /(<key>LSMinimumSystemVersion<\/key><string>)[^<]+/,
    (_, prefix) => prefix + minimumOS,
  ),
);
await cp(binary, join(contents, 'Resources', 'runtime', 'node'));
await cp(license, join(contents, 'Resources', 'runtime', 'NODE-LICENSE.txt'));
await mkdir(join(contents, 'Resources', 'game'), { recursive: true });
for (const name of ['dist', 'server'])
  await cp(join(root, name), join(contents, 'Resources', 'game', name), {
    recursive: true,
    filter: (path) => !path.endsWith('Dockerfile') && !basename(path).startsWith('._'),
  });
await cp(join(root, 'package.json'), join(contents, 'Resources', 'game', 'package.json'));
await mkdir(join(contents, 'Resources', 'game', 'src', 'lib'), { recursive: true });
await cp(
  join(root, 'src', 'lib', 'season-content.mjs'),
  join(contents, 'Resources', 'game', 'src', 'lib', 'season-content.mjs'),
);

// Embed a self-contained compiler/runtime so new curriculum types run offline.
// jlink retains the selected JDK distribution's legal notices.
const jdk = await javaHome();
const javaRuntime = join(contents, 'Resources', 'game', 'java-runtime');
run(join(jdk, 'bin', 'jlink'), [
  '--add-modules',
  'java.base,java.compiler,jdk.compiler,jdk.zipfs',
  '--strip-debug',
  '--no-header-files',
  '--no-man-pages',
  '--compress=2',
  '--output',
  javaRuntime,
]);
// Sign every native JVM component before signing the enclosing app.
async function signNative(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await signNative(path);
    else if (entry.isFile()) {
      const handle = await open(path, 'r');
      const header = Buffer.alloc(4);
      await handle.read(header, 0, 4, 0);
      await handle.close();
      if ([0xfeedfacf, 0xcffaedfe, 0xcafebabe].includes(header.readUInt32BE()))
        run('codesign', ['--force', '--sign', '-', path]);
    }
  }
}
await signNative(javaRuntime);

if (await stat(join(root, 'LICENSE')).catch(() => null))
  await cp(join(root, 'LICENSE'), join(contents, 'Resources', 'LICENSE.txt'));
const arch = execFileSync('lipo', ['-archs', binary], { encoding: 'utf8' }).trim();
const target = arch.includes('arm64') ? 'arm64' : 'x86_64';
run('xcrun', [
  'swiftc',
  '-swift-version',
  '5',
  '-O',
  '-target',
  `${target}-apple-macosx${minimumOS}`,
  '-module-cache-path',
  cache,
  '-framework',
  'Cocoa',
  '-framework',
  'WebKit',
  join(root, 'desktop', 'DEVQUEST.swift'),
  join(root, 'desktop', 'SaveLibraryStore.swift'),
  '-o',
  join(contents, 'MacOS', 'DEVQUEST'),
]);
const icon = join(root, '.build', 'make-icon'),
  iconset = join(root, '.build', 'AppIcon.iconset');
run('xcrun', [
  'swiftc',
  '-swift-version',
  '5',
  '-module-cache-path',
  cache,
  '-framework',
  'Cocoa',
  join(root, 'desktop', 'Icon.swift'),
  '-o',
  icon,
]);
run(icon, [iconset]);
// Pack PNG icon representations directly. This also works on build hosts where
// iconutil cannot spawn its additional sandboxed image conversion service.
const iconChunks = [];
for (const [type, name] of [
  ['icp4', '16x16'],
  ['icp5', '32x32'],
  ['icp6', '32x32@2x'],
  ['ic07', '128x128'],
  ['ic08', '256x256'],
  ['ic09', '512x512'],
  ['ic10', '512x512@2x'],
  ['ic11', '16x16@2x'],
  ['ic12', '32x32@2x'],
  ['ic13', '128x128@2x'],
  ['ic14', '256x256@2x'],
]) {
  const png = await readFile(join(iconset, `icon_${name}.png`));
  const header = Buffer.alloc(8);
  header.write(type);
  header.writeUInt32BE(png.length + 8, 4);
  iconChunks.push(header, png);
}
const iconHeader = Buffer.alloc(8);
iconHeader.write('icns');
iconHeader.writeUInt32BE(8 + iconChunks.reduce((sum, chunk) => sum + chunk.length, 0), 4);
await writeFile(
  join(contents, 'Resources', 'AppIcon.icns'),
  Buffer.concat([iconHeader, ...iconChunks]),
);
// External exFAT drives may create AppleDouble sidecars for compiler metadata.
// They must not be treated as extra executable components by codesign.
async function removeSidecars(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.name.startsWith('._')) await rm(path, { recursive: true, force: true });
    else if (entry.isDirectory()) await removeSidecars(path);
  }
}
await removeSidecars(app);
run('codesign', ['--force', '--sign', '-', join(contents, 'Resources', 'runtime', 'node')]);
run('codesign', ['--force', '--sign', '-', app]);
run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', app]);
const zip = join(release, `DEVQUEST-${version}-macos-${target}.zip`);
await rm(zip, { force: true });
run('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', app, zip]);
const checksum = createHash('sha256')
  .update(await readFile(zip))
  .digest('hex');
await writeFile(zip + '.sha256', `${checksum}  ${zip.split('/').at(-1)}\n`);
const releaseApp = join(release, 'DEVQUEST.app');
await rm(releaseApp, { recursive: true, force: true });
await cp(app, releaseApp, { recursive: true, verbatimSymlinks: true });
await removeSidecars(releaseApp);
run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', releaseApp]);
await rm(staging, { recursive: true, force: true });
console.log(
  `\nBuilt ${releaseApp}\nDownload ${zip}\nArchitecture: ${target} · Ad-hoc signed · macOS ${minimumOS}+\nNo Node.js installation, browser, or network connection required to play.`,
);
