# First-day acceptance

The original acceptance items are implemented in the first-day slice:

- Explore the 40×25 tile office with WASD/arrows, collision-aware movement, and a bounded following camera.
- Observe idle, walking, typing, and celebration sprite states.
- Speak with Alex to activate the registration ticket, and return to claim the epilogue reward.
- Edit the Java method, run sample tests, submit additional review cases, and see useful failure feedback. The bundled runtime supports a bounded expression subset; full compilation is an optional Docker development profile.
- Execute real SQL against a local SQLite database; filter pending orders and connect them with customers.
- Reveal handwritten hints progressively without XP penalties.
- Earn XP once per completed task and unlock the first-day achievement.
- Place a plant, cat, or lamp at the workstation after the epilogue.
- Resume missions, code, notes, hints, cosmetics, and progression after reopening the app.

## Automated validation

`npm run check` checks Java practice semantics, rejection of executable/malformed input, SQL results and alternate datasets, read-only restrictions, infinite-query cancellation, idempotent rewards, save restoration, map collision, and reachability of all interactive objects. TypeScript and the production build are also required.

The full Java integration test is skipped unless `DEVQUEST_TEST_DOCKER=1`; the dedicated CI job builds the isolated Java image and runs it. A locally inaccessible Docker daemon is not recorded as a passing integration test.

## Manual desktop walkthrough

1. Launch the packaged `.app` without a running development server.
2. Create an avatar, use the quest button to meet Alex, and finish all onboarding dialogue.
3. Open the workstation and run the starter. Age 18 must fail while 17 and 19 pass.
4. Edit the comparison, rerun, and submit. Confirm 120 XP and 40 coins. Reopening/submitting must not award more.
5. Open the SQL terminal. Inspect the schema, run queries, and submit the exact requested pending-order projection.
6. Continue to the customer investigation. Submit a relational query with the requested column aliases.
7. Return to Alex, claim the achievement, choose a decoration, and see it in the office.
8. Write a journal note, quit through the native menu, reopen, and check persistence.
9. Export and import a save through the File menu. Confirm Command-C/V/A in the editor.
10. Explore all three spaces; test walls/furniture, interaction range, Room directory, hints, and training labs.

## Release checks

The Mac build must pass `codesign --verify --deep --strict`. The packaged runtime must have only system library dependencies. ZIP integrity and SHA-256 are checked before delivery. Local ad-hoc signing is separate from Developer ID signing and Apple notarization.

## 0.3.0 local verification — 2026-10-26

- `npm run check`: 25 passed, zero failed, one optional Docker integration test skipped. This includes three movement/camera tests for normalized input, braking, frame-rate-independent damping, and camera bounds; updated map reachability also passes.
- The packaged native app launches offline in full screen and restores the existing developer, completed missions, code, XP, and coins. No save reset was performed.
- Native UI walkthrough checked the illustrated world, adjusted furniture/NPC placement, pause-menu composition and desk scene, opening/closing overlays, map-to-mentor navigation, progressively revealed dialogue, E to continue, and the highlighted Java editor running its three passing samples.
- A native inactive-window regression was found during this walkthrough: WebKit could hold CSS fades at zero opacity. Essential text now starts visible; modal/typewriter timing uses the shared frame clock with a native watchdog. The corrected packaged build visibly shows all sample rows and feedback.
- The build script verified the app signature and bundled runtime dependencies. The final ZIP integrity check passed and its SHA-256 matches the delivered checksum. Public notarization and the optional Docker compiler are outside this local verification.
