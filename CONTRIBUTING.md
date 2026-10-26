# Contributing

Start from `develop`, create a focused `feature/…`, `fix/…`, or `docs/…` branch, and keep commits small enough to review. Use present-tense commit subjects such as `feat: add a new investigation` or `fix: preserve editor drafts on reopen`.

Run `npm ci` followed by `npm run check` before opening a pull request. For desktop changes, build and launch the Mac app, check native menus and save persistence, then update the acceptance notes. Test the Docker adapter only when changing it and a Docker daemon is available.

Pull requests should explain the concrete behavior change, why it matters, how it was checked, and any limits. Include a screenshot for visible changes. Never commit app bundles, node_modules, credentials, or user saves.

Curriculum must be original. Hints should teach an approach, never overwrite the player's code. Keep the learner in control, allow mistakes without penalties, and distinguish guided completion from independent mastery.
