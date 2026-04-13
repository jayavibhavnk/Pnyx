# Changelog

## 0.2.0

- **Compatibility:** Core `pnyx` has **no runtime dependency** on Agentfuse. Install `agentfuse` only when you use the bridge.
- **Subpath** `pnyx/agentfuse` exports `appendFromFuseMessage` and `mergePrompt` (re-exported for convenience).
- **Peer dependency** `agentfuse` is **optional** (`peerDependenciesMeta.optional`).
- **Package:** `sideEffects: false`, explicit `exports` map for bundlers (Vite, Webpack, esbuild, Rollup).

## 0.1.0

- Initial release: `SharedMemory`, `AssemblyRegistry`, Agentfuse bridge (`appendFromFuseMessage`, `mergePrompt`).
