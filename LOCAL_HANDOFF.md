# Local delivery

The application source is in `/Volumes/T7/DEVQUEST`.

- Launch `release/DEVQUEST.app` directly, or unzip `release/DEVQUEST-0.2.0-macos-arm64.zip` and move it into Applications.
- This is an Apple Silicon build with local ad-hoc signing, not Apple notarization.
- The running Mac may contain the synthetic `QA Developer` test save. Use Help → Start a fresh first day to start your own game. The distributable contains no player save.
- Browser development progress can be exported from Help and imported into the desktop app from File → Import Progress.

## Repository

The environment prevents writes to the workspace `.git` directory. The complete prepared repository, including branches and commits, is at `/private/tmp/devquest-repository`. `DEVQUEST-history.bundle` preserves those refs in this workspace for durable recovery.

No GitHub publication is claimed without a successful push and remote verification. Shell network access cannot currently resolve GitHub, and the GitHub integration has not been connected.

To recover the history into a new folder:

```sh
git clone /Volumes/T7/DEVQUEST/DEVQUEST-history.bundle /path/to/DEVQUEST-repository
cd /path/to/DEVQUEST-repository
git remote rename origin delivery-bundle
git remote add origin https://github.com/ioanaghi/DEVQUEST.git
git fetch origin
```

Safari verification found an existing `main` commit (`33ef63c`) containing only the original README. Preserve that commit when integrating. After fetching:

```sh
git switch main
git merge origin/main --allow-unrelated-histories
# If README.md conflicts, retain the completed project README, then:
# git add README.md && git commit
git push origin main
git push origin 'refs/remotes/delivery-bundle/*:refs/heads/*'
```

The prepared checkout already has local branches, so from `/private/tmp/devquest-repository` merge the fetched initial `origin/main` first, then use `git push origin --all` once connectivity is available. Do not force-push if the remote already contains work.
