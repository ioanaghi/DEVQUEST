# Local delivery

The application source is in `/Volumes/T7/DEVQUEST`.

- Launch `release/DEVQUEST.app` directly, or unzip `release/DEVQUEST-0.3.0-macos-arm64.zip` and move it into Applications.
- This is an Apple Silicon build with local ad-hoc signing, not Apple notarization.
- The running Mac may contain the synthetic `QA Developer` test save. Use Help → Start a fresh first day to start your own game. The distributable contains no player save.
- Browser development progress can be exported from Help and imported into the desktop app from File → Import Progress.

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
