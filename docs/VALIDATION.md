# 0.4.0 validation

Validated locally on Apple Silicon macOS on 2026-10-27.

- 32 automated tests passed; one optional Docker integration test was skipped. New coverage checks both pair-finding approaches, instrumented growth, invalid/self-reusing/hard-coded answers, runtime budgets and type errors, custom QA inputs, ordered progression, idempotent rewards, old-save migration, and the native checkout protocol.
- TypeScript checking and the production frontend build passed.
- The native Swift host compiled; the app passed strict deep signature verification with its local ad-hoc signature.
- Browser smoke checks covered onboarding and importing a synthetic first-day-complete save at a separate origin. The Checkout Incident appeared as the active quest with the Friday HUD. A complete nine-mission graphical playthrough has not been claimed.
- The checkout interpreter is a bounded Java subset. Its operation-growth checks demonstrate behavior on controlled inputs rather than proving arbitrary algorithmic complexity. Full Java Docker execution remains optional and was not verified here.
- The package is Apple Silicon, macOS 13.5+, and ad-hoc signed. Developer ID notarization and Intel builds are not part of this local validation.

The earlier first-day validation below describes the previous release.

# 0.1.0 validation

Validated locally on Apple Silicon macOS on 2026-10-26.

## Automated

- 22 tests passed; one Docker integration test skipped because the Docker daemon was inaccessible.
- TypeScript checking and production interface build passed.
- Native Swift/AppKit/WebKit host compiled successfully.
- App bundle passed `codesign --verify --deep --strict`.
- The runtime has system-only dynamic library dependencies and includes the Node license.
- The ZIP archive passed integrity verification and includes a matching SHA-256 file.
- The lockfile includes Linux x64 and both Mac architectures for clean CI installation. Hosted GitHub Actions have not yet been run.

## Native app walkthrough

The packaged application opened independently of Safari using the `devquest://app/` scheme. A synthetic QA player completed Alex's onboarding, observed the original Java boundary failure, edited the method with native copy/paste, passed the sample and review cases, completed both SQLite investigation steps, received 400 XP and 120 coins, claimed the first achievement, and placed a plant.

The app was closed and reopened. The completed missions, rewards, code, avatar, and plant were retained in the native save file. The office and avatar canvases were visually checked after correcting native frame scheduling. The File menu opened the macOS export panel; a complete export/import round trip was not claimed.

## Distribution limits

This artifact targets Apple Silicon and macOS 13.5 or newer. It is ad-hoc signed, not notarized by Apple. Intel support is provided through the build recipe and CI configuration but was not run locally. Java practice is a bounded expression interpreter; full Docker compilation was not verified on this machine.

GitHub's existing README commit was inspected in Safari. The code, branch history, and application are prepared locally; GitHub publication requires a working Git connection and preservation of the existing remote commit.

# 0.5.0 — Season 1 validation

- `npm run check`: 74 tests, 73 passed, 1 optional Docker integration test skipped; TypeScript and Vite production build passed.
- After strengthening the positive-target growth workloads, the full 41-test Season 1 suite passed again.
- All 29 Java/SQL assessments have passing player-code fixtures. Checks cover invalid starters, quadratic implementations, unsafe/unsupported source, infinite loops, invalid indices, Unicode code-point palindromes, custom inputs, changed SQL datasets, original linked-node identity, independent prerequisites, retention chronology, save migration and duplicate rewards.
- Safari walkthrough on an isolated preview origin: imported a synthetic save; completed all eight Warehouse missions, including wrong-move feedback, sorted-array reasoning, Java submission, QA predictions and two custom manifests, code review and the five-phase independent palindrome interview. Verified the 350-XP interview reward and Traffic episode handoff. The real desktop player save was not replaced by this walkthrough.
- Inspected the rendered mission dialog and parcel matcher. Fixed the existing inactive-Safari frame suspension so dialogs and the office continue rendering.
- Native packaging rebuilt `release/DEVQUEST.app` and the 0.5.0 Apple Silicon ZIP. Both staged and delivered app passed deep strict code-signature verification. Relative Java legal-notice symlinks remain intact after copying.
- Packaged-runtime smoke checks use the bundled Node and Java compiler, with a minimal environment, for Unicode palindromes, notification interfaces and real SQLite unpaid-order queries. No host Node/JDK is required by the distributed application.

The rooms are dedicated panel views with practice stations, alongside the existing walking office. Java assessment combines restricted source, a deprecated JVM Security Manager policy, bounded resources and controlled operation checks; it is not an OS container or a mathematical complexity proof. See `SEASON-1.md` for the runtime boundary.

Final native screenshot capture was unavailable because ScreenCaptureKit returned a capture failure. The browser walkthrough, compiled app signature verification, bundled-runtime checks and archive checksum succeeded. The temporary preview server was stopped after QA.

# 0.6.0 — Main menu and save slots

- Full check: 83 tests; 82 passed, one optional Docker test skipped; TypeScript and Vite passed.
- Eight slot-library tests cover migration, three independent characters, drafts/notes/XP, save switching, reset, replacement, backup imports and invalid-data preservation.
- A compiled Swift test runs the actual native save store against temporary files, verifies atomic persistence and reload, preserves the old single-save file, and refuses to overwrite a damaged library.
- Live browser walkthrough: legacy Slot 1 retained 2,080 XP; a customized Slot 2 began at the Alex introduction with 0 XP. Save & main menu returned to the title; reload kept both slots. Reset confirmation was cancelled without changes; Slot 1 resumed its original Pager Alert quest.
- Inspected the three-slot screen visually. Confirmations use native HTML dialogs for focus trapping. The title screen scrolls at smaller window heights, and native Escape supports title navigation.
- Rebuilt the 0.6.0 Mac application and ZIP with the new native store, save-before-quit flow, and strict code-signature verification. The distributed app contains no player/test save.
