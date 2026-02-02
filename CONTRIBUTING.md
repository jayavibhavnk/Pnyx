# Contributing to Pnyx

Pnyx is intentionally small: memory + registry + Agentfuse glue. Keep changes focused.

## Setup

```bash
git clone <your-fork>
cd pnyx
npm install
```

Build Agentfuse once (sibling checkout):

```bash
(cd ../agentfuse && npm run build)
npm run build
npm test
```

## Guidelines

- **Strict TypeScript** — no `any` without a short justification in code.
- **Tests** — add or update `src/*.test.ts` for behavior changes.
- **Docs** — update README if you change public API or limits.

## Pull requests

One logical change per PR, conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).

## Code of conduct

Be respectful and assume good intent, as in any small OSS project.
