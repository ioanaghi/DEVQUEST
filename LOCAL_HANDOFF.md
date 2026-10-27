# Local delivery

The application source is in `/Volumes/T7/DEVQUEST`.

- Launch `release/DEVQUEST.app` directly, or unzip `release/DEVQUEST-0.6.0-macos-arm64.zip` and move it into Applications.
- This is an Apple Silicon build with local ad-hoc signing, not Apple notarization.
- The running Mac may contain the synthetic `QA Developer` test save. Use Help → Start a fresh first day to start your own game. The distributable contains no player save.
- Browser development progress can be exported from Help and imported into the desktop app from File → Import Progress.

## Checkout Incident update (0.4)

Finish the first-day tickets, claim Alex’s gift, and place a decoration. Nora’s Emergency Meeting then becomes the current quest. Press Q to revisit any unlocked Checkout Incident mission. Progress and all three code drafts use the existing save file; no reset is required.

The new source is in this workspace. Earlier 0.3 history bundles and source ZIPs predate the checkout changes; use the workspace for the current implementation. The 0.4 application ZIP is the playable build.

## Repository

The workspace Git metadata is protected from agent writes. The prepared repository with feature, develop, release, and main branches is at `/private/tmp/devquest-repository`. `DEVQUEST-history.bundle` and `release/DEVQUEST-0.3.0-source-with-history.zip` preserve those refs for durable recovery.

The prepared release includes the existing workspace `design` history (`0cd4355`, descended from `33ef63c`) as an ancestor. The current source was synchronized before that integration. No existing GitHub history needs to be replaced. This does not claim a GitHub push or hosted CI result.

To recover the history into a new folder:

```sh
git clone /Volumes/T7/DEVQUEST/DEVQUEST-history.bundle /path/to/DEVQUEST-repository
cd /path/to/DEVQUEST-repository
git remote rename origin delivery-bundle
git remote add origin https://github.com/ioanaghi/DEVQUEST.git
git fetch origin
git switch main
git merge origin/main
```

Inspect any newer remote work before pushing. Do not force-push shared branches. The source ZIP already includes local branches and the GitHub origin URL; it can be opened as a normal repository.

## Season 1 update (0.5)

All eight episodes in `to_do/Quests2.md` are implemented. Press Q for the board; after Checkout the next objective is Warehouse Alert with Nora. SQL and OOP also open independently after their first-day prerequisites. No save reset is needed. The release bundles its Java compiler/runtime. See `docs/SEASON-1.md` for contracts, scope, learning progression and runner limits.

## Three save slots (0.6)

The app opens on a landing page. Start Game opens three slots; New Game customizes a fresh developer and begins at Alex. Continue resumes an occupied slot. Your previous native save migrates into Slot 1 and the original first-day.json stays untouched. Escape → Save & main menu switches sessions. Reset confirmation applies to one slot only. See docs/SAVE-SLOTS.md. Quit and reopen the newly rebuilt app to use the new native save protocol.
