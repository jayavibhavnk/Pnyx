# Examples

Run **`npm run build`** from the repo root first (and **`npm run build`** in `../agentfuse`).

Examples import **`../dist/index.js`** so they work without publishing to npm.

## `handoff.ts`

Builds a shared transcript under a task id, then runs `Agentfuse` with `mergePrompt` so the CLI sees prior “agent” work.

```bash
npm run build
node --experimental-strip-types examples/handoff.ts claude
```

If no CLI is found, the script prints the beginning of the merged prompt and exits with code 1.
