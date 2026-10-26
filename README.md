# DEVQUEST

**Your first day as a developer. A cozy, offline Mac game.**

Walk into PixelByte Studios, meet your mentor, fix your first Java bug, and follow a trail of missing orders through a real SQL database. Learn by experimenting, testing, and thinking for yourself. No AI-generated answers, timers, or penalties for getting something wrong.

DEVQUEST is a native **macOS `.app`** with a Swift/AppKit window, menus, and an embedded WebKit game interface. The runtime ships inside the app. Players do not need a browser, Node.js, a terminal, an account, or an internet connection.

## Play on Mac

The desktop build produces `release/DEVQUEST.app` and `release/DEVQUEST-0.3.0-macos-arm64.zip` on Apple Silicon. Unzip the archive and drag **DEVQUEST.app** into Applications. Minimum supported OS: macOS 13.5. Intel builds require the corresponding x64 Node distribution and a matching build; the local artifact is Apple Silicon only.

The development build is ad-hoc signed. Public distribution with normal Gatekeeper verification requires an Apple Developer ID signature and Apple notarization. No certificate or notarization is bundled into this repository.

## Game presentation

The office fills the window and the Mac app starts in native full screen. A compact HUD tracks your developer and current quest. Escape opens the pause menu; Q opens quests, J the journal, K skills, I the backpack, and M the office map. All secondary screens appear as in-game pop-ups. Full screen can be changed in the pause menu or the native View menu. Existing saves remain compatible.

Version 0.3 adds a detailed illustrated office, warmer lighting, smoother acceleration and camera movement, distance-based character animation, subtle ambient motion, and optional synthesized interface sounds. Menus ease in and out; dialogue reveals at a readable pace and can be skipped with E. The editor adds syntax highlighting, synchronized line numbers, and Tab indentation. System Reduce Motion is respected. [Art direction and asset provenance](docs/ART-DIRECTION.md) describe the visual work.

## Your first day

- Create a developer: name, skin tone, hairstyle, hoodie, and glasses.
- Explore an original 40 × 25 tile office with three connected spaces, collision detection, a following camera, and animated characters.
- Meet Alex and follow a handwritten onboarding story.
- Fix ticket **#001**, an incorrect Java registration check. Run sample tests, then submit against additional cases.
- Investigate ticket **#104** with real SQLite: find pending orders, then connect them to customers using a JOIN.
- Earn **400 XP**, **120 dev coins**, and the **Hello, World!** achievement. Choose a plant, cat, or lamp for your desk.
- Use progressive hints, a small training lab, a skill tree, and your own developer journal.
- Resume your saved code, progress, avatar, notes, and decoration after quitting and reopening.

**Controls:** WASD or arrows to walk, hold Shift to move faster, E to interact, Escape to pause or close a pop-up, Command/Ctrl + Enter to run code. The quest button and office map provide equivalent interactions without movement. Native Edit menu shortcuts work in the editor.

## Develop

Requirements: Node.js **22.13+**, npm. macOS builds additionally require Xcode Command Line Tools.

```sh
npm ci
npm run dev
```

The development interface runs at `http://127.0.0.1:5173`, with a loopback-only runner at port 8082. This browser mode is a development preview; the distributed Mac application uses a native bridge and starts no HTTP server.

```sh
npm run check       # runtime, progression, and map tests + TypeScript + production build
npm run build       # production interface
npm start           # serve the production build locally, for development QA
```

## Build the Mac application

Use an **official, self-contained Node.js macOS distribution**, including its LICENSE. Homebrew's dynamically linked Node binaries cannot be distributed alone. The build checks this and rejects external runtime library dependencies.

```sh
DEVQUEST_NODE_BINARY=/path/to/node-darwin-arm64/bin/node \
DEVQUEST_NODE_LICENSE=/path/to/node-darwin-arm64/LICENSE \
npm run desktop:build
```

With an official Node distribution already on PATH and its LICENSE in the parent directory, `npm run desktop:build` is sufficient. The script compiles the Swift launcher, builds the frontend and icon, embeds Node and the learning runtimes, ad-hoc signs the application, verifies its signature, and creates a ZIP with SHA-256 checksum. It does not download dependencies or require an Apple developer account.

[The macOS workflow](.github/workflows/macos.yml) builds a downloadable Actions artifact using an official Node distribution. It can also be run manually. It does not publish a release automatically.

## How code runs

**SQL is real SQLite**, backed by `node:sqlite`, with a fresh seeded, in-memory database for each run. Queries are read-only. Separate processes enforce a time limit; responses are capped at 500 rows. Submissions are checked against a second dataset so hard-coded sample answers do not pass.

**Default Java is a bounded practice interpreter, not a complete Java compiler.** It parses the provided `canRegister(int age)` method with one boolean return expression. Comparisons, boolean logic, parentheses, and integer arithmetic are supported. It uses an AST interpreter, never `eval`, `Function`, a host shell, or direct execution of user Java. Both the editor and handbook identify this mode explicitly.

**Full Java compilation is optional in development**, using disposable Docker containers:

```sh
npm run java:build
JAVA_RUNNER=docker npm run dev
```

The runner uses Java 21, no network, a read-only filesystem, a temporary workspace, a non-root user, process/CPU/memory/output limits, and a timeout. The desktop release deliberately ships the bounded practice mode so it remains fully offline and requires no Docker or JDK installation. The Docker path has its own CI integration check; local verification requires a running Docker daemon.

## Saves

Desktop progress is stored atomically in:

```text
~/Library/Application Support/DEVQUEST/first-day.json
```

Export/import through **File → Export Progress / Import Progress** or the handbook. Saves are versioned and validated. Browser development saves use localStorage and can be exported, then imported into the desktop app. XP is derived from completed missions and cannot be awarded twice by repeating a submission.

## Engineering notes

- [Architecture and runtime decisions](docs/ARCHITECTURE.md)
- [First-level acceptance and manual QA](docs/ACCEPTANCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Branching and publishing](docs/GIT_WORKFLOW.md)
- [Contributing](CONTRIBUTING.md)
- [Original game vision](General.md) and [first-level brief](First_level.md)

Only the first-day vertical slice is playable. The ten later curriculum chapters are marked **planned** in the journey screen. Accounts, cloud saves, multiplayer, a coin shop, and independent mastery challenges are future work.

The office environment is an original AI-generated pixel-art bitmap made from a project-authored floor-plan reference. Character sprites, animations, lighting effects, icons, and the fallback environment are drawn in code. No reference-game assets are copied. See [asset provenance and the generation prompt](docs/ART-DIRECTION.md). React, Vite, TypeScript, Node.js, and Apple system frameworks retain their respective licenses; the embedded Node distribution includes its complete license notices.
