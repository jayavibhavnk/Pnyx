# Contributing to Pnyx

Pnyx is intentionally small: memory + registry + Agentfuse glue. Keep changes focused.

## Setup

Clone this repo and [Agentfuse](https://github.com/jayavibhavnk/AgentFuse---ACP) as **siblings** (see README). Then:

```bash
cd ../agentfuse && npm install && npm run build
cd ../Pnyx && npm install && npm run verify
```

## Guidelines

- **Strict TypeScript** — no `any` without a short justification in code.
- **Tests** — add or update `src/*.test.ts` for behavior changes.
- **Docs** — update README if you change public API or limits.

## Pull requests

One logical change per PR, conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).

## Code of conduct

Be respectful and assume good intent, as in any small OSS project.
