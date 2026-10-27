# Architecture

DEVQUEST separates the game, curriculum, progression, execution, and host platform. The deliverable is a Mac application. A browser mode remains available for fast development.

## Desktop host

`desktop/DEVQUEST.swift` creates the AppKit window, native menus, and WKWebView. A `WKURLSchemeHandler` serves packaged assets from `devquest://app/`. Navigation is restricted to that origin. No development server, internet connection, or browser is used at runtime.

The TypeScript platform adapter sends structured messages to a native WKScriptMessageHandler. Swift accepts requests from the main app frame only, checks the operation and payload size, then launches the bundled Node executable for the requested check. Results are serialized as JSON before being passed back to JavaScript. Source code is never interpolated into a shell or a JavaScript callback.

The bridge also performs atomic save writes and native file import/export. Renderer storage is not relied on for desktop saves. A startup gate waits for the native save to load before mounting the world, preventing an empty initial state from overwriting an existing save.

Node runs only during a check, not as a persistent server. Concurrent jobs and timeouts are bounded. Closing the app terminates active direct child processes; SQL child processes also have their own short timeout.

## Game and interface

- `src/game/world.mjs`: map dimensions, solid rectangles, interactables, movement, proximity, room identification.
- `src/game/art.ts`: original pixel art and sprite animations.
- `src/game/GameWorld.tsx`: rendering loop, integer pixel scaling matched to the window, camera bounds, input, proximity UI, and the accessible office map and room shortcuts.
- `src/components/Workspace.tsx`: editable code, sample runs, submission, results, handwritten hints, and schema panels.
- `src/lib/content.ts`: original teaching content, hints, chapter roadmap.
- `src/lib/progression.mjs`: pure quest transitions, idempotent completion, rewards, and save restoration.
- `src/lib/platform.ts`: native desktop bridge or HTTP development adapter.

The canvas loop reads current props through refs, while React manages panels and durable state. It pauses input during panels, clears movement keys on blur, normalizes diagonal movement, and uses small collision steps to prevent tunneling. Unreachable spawn points recover to the entrance.

## Execution

`server/desktop-runner.mjs` handles a single native request over stdin/stdout. `server/index.mjs` supplies the equivalent HTTP endpoints for development.

The SQL checker creates a fresh SQLite database, switches it to query-only mode, limits statement categories, checks exact requested columns and row multisets, and compares submission behavior on a changed dataset. A dedicated OS process enforces a 1.5-second wall timeout. Threads were insufficient because a synchronous native SQLite call cannot reliably be interrupted by terminating a JavaScript worker.

Java practice parses a narrow expression grammar into a typed AST. It does not run arbitrary Java. Integer arithmetic follows 32-bit Java semantics for the supported expressions. Unsupported source is rejected with a clear message. Actual Java compilation uses the optional Docker adapter. Neither path provides automated AI answers.

## Decisions relative to the design proposal

The briefs proposed Phaser, Monaco, and sql.js. This implementation uses an original Canvas2D renderer, an accessible textarea editor with line numbers and shortcuts, and SQLite inside the packaged Node runtime. This keeps the first desktop build small in implementation scope and independent of online services. These are explicit implementation choices; this repository does not claim to include those proposed libraries.

A full editor and Phaser can be introduced behind the existing UI/world boundaries. A browser-only SQL runner can later replace the platform adapter without changing quest logic. The first-day curriculum is deliberately scoped; planned chapters do not appear as playable content.

## Distribution

The build requires a self-contained Node macOS binary with system-only dynamic dependencies. It bundles the complete Node license. Swift is compiled for macOS 13.5+ and the runtime's architecture. The ZIP contains the `.app` and preserves executable permissions. Local builds use ad-hoc signing; a public release needs Developer ID signing and notarization as a separate release operation.

Native storage uses the application support directory. The game has no accounts, telemetry, API keys, or external asset fetches. The optional Docker runner is intended for a trusted local machine; public multi-user deployment would require a separately operated execution service.

## Immersive presentation (0.2)

The game canvas fills the application content area. HUD elements float over the world; all navigation opens modal game overlays. Escape is consumed by the native GameWindow and forwarded as a game event, preventing AppKit from leaving full screen when a dialogue closes. Native full-screen preference is retained across launches. The first launch of the new presentation starts full screen.

The office background is rendered once into a cached pixel canvas. Furniture and characters are composited in depth order, with live monitor indicators, steam, dust, and celebration accents. World geometry and saved positions remain compatible with the first-day save format.

## Checkout mission pipeline (0.4)

`src/lib/checkout.mjs` defines the nine missions, starters, ordered transitions, and save restoration. The arc is stored separately from first-day mission IDs inside the existing version-1 save envelope, so old saves gain empty arc progress without losing first-day rewards. XP is derived from unique completed mission IDs. `CheckoutArc.tsx` renders deterministic interaction types and retains the player’s draft, hints, answers, custom tests, and interview phase. Delivery returns the player to the office; quest markers lead to the next NPC.

`server/pair-java.mjs` parses the supported method into a bounded AST. It does not translate or execute source as JavaScript. Evaluation uses local scopes, integer arithmetic, safe array reads, explicit map methods, nesting limits, source limits, and operation budgets. Native and HTTP endpoints expose the same evaluator at `/api/pair`. The original registration interpreter and optional Docker adapter remain separate.

Functional checks validate the returned indices against the contract instead of comparing against one fixed pair. Hidden checks include empty/singleton inputs, duplicates, negatives, zeros, and changed values. Optimization review counts interpreted operations on no-match arrays of 128 and 256 entries and checks map lookups and measured growth; this is explicitly a controlled check, not a proof for arbitrary programs. The interview score distinguishes correctness, measured efficiency, hidden edge cases, and structured reasoning. Hints make an attempt guided; completing the story does not grant retention mastery.

## Season 1 (0.5)

`season-content.mjs` defines all 60 new mission steps, authored dialogues, editor contracts, four-level hints, QA predictions, review questions and later transfer problems. `season.mjs` controls linear per-episode progression, independent SQL/OOP paths, derived rewards and chronological retention. `SeasonArc` shares coding, five-phase interviews, QA, scorecards and room views; `SeasonLabs` contains the interactive concept experiments. The office adds five colleagues and original code-drawn rewards.

`/api/season` supports browser and native requests. Java uses a fresh compiler workspace and a restricted, metered, memory/time-limited JVM; SQL runs in a killable read-only SQLite child process. The build embeds a compact Java compiler/runtime and the shared curriculum module required by the runner. See [Season 1](SEASON-1.md) for the isolation limits and precise contracts.

Save schema version 1 remains compatible. Season state stores code, answers, hints, custom tests, independent-pass completion counts and retention results. Three missions completed after an independent interview unlock its separate mastery problem. Native save/import and browser import limits are 512 KiB.

## Three save slots (0.6)

`save-slots.mjs` wraps version-1 character saves in a separate three-entry library, normalizes imported progress, and migrates the previous single character into Slot 1. `TitleScreen` owns title, slot selection, confirmation and uncommitted character customization views. Gameplay stays unmounted until a slot has been selected and persisted.

The frontend serializes library writes and waits before switching sessions. `SaveLibraryStore.swift` stores the native library atomically in `save-slots.json`, treats `first-day.json` as read-only migration input, and preserves unreadable files. Native quit/window-close requests ask the frontend to flush; a failed or in-flight save cancels termination. See [save slots](SAVE-SLOTS.md).
