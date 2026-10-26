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
