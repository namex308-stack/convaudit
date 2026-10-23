# Contributing to Convaudit

Thanks for considering a contribution. Bug reports, focused improvements, and
documentation updates are welcome.

## Before you start

- Search existing issues before opening a new one.
- For substantial changes, open an issue first to discuss the approach.
- Keep pull requests focused and describe user-visible changes.

## Development setup

1. Install Node.js 20.9 or newer and npm.
2. Follow the setup steps in the [README](README.md).
3. Keep credentials and local environment files out of commits.

## Checks

Run the relevant checks before submitting:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Include or update tests when changing behavior. If a check cannot be run,
mention that in the pull request.

## Pull requests

- Explain the problem and the solution.
- Link related issues.
- Include screenshots for user interface changes when useful.
- Call out any configuration or migration requirements.
- Confirm that no secrets or generated build files are included.
