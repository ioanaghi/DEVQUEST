# Git workflow

`main` contains verified releases. `develop` is the integration branch. Work starts on focused branches and merges through reviewable changes. Commits use present-tense conventional subjects and reflect real work at the current date.

## Initial implementation branches

- `feature/project-foundation`: React/TypeScript build and development scripts.
- `feature/learning-runtimes`: SQL investigations and Java execution adapters.
- `feature/pixelbyte-world`: original office art, movement, camera, and interactions.
- `feature/first-day-quests`: story, workspaces, hints, saves, and rewards.
- `fix/runtime-timeouts`: killable SQL processes and regression checks.
- `feature/macos-desktop`: native host, bundled runtime, and packaging.
- `chore/quality-and-docs`: contributor guidance, workflows, acceptance notes.
- `release/0.1.0`: verified first-day desktop release.

Feature branches merge into `develop` with merge commits. A release branch records final verification, merges into `main`, and then back into `develop`. Preserve the initial feature branches as a readable project history; future branches can be removed after merge.

## Daily development

```sh
git switch develop
git pull --ff-only
git switch -c feature/your-change
# implement and run npm run check
git add <changed-files>
git commit -m "feat: describe the resulting behavior"
git push -u origin feature/your-change
```

Open a pull request into `develop`, explain the behavior and validation, and include a screenshot for visible changes. The repository supplies a pull request template. Do not fabricate reviews or claim local tests are hosted CI results.

## Releases

Branch `release/<version>` from a green `develop`. Run checks, build and manually verify the native Mac artifact, record the result in acceptance notes, then merge into `main`. Tag the actual release commit and attach the ZIP/checksum when publishing a GitHub release. CI artifacts and local bundles are not themselves published releases.

Configure `main` and `develop` branch protections in GitHub when the repository is published. Require checks and real reviews if working with collaborators. Avoid force-pushing shared branches and preserve existing remote history.
