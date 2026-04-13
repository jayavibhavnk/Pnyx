# Changelog

## 0.3.0

- **Package name** is now **`@jayavibhavnk/pnyx`** (required for GitHub Packages).
- **`publishConfig.registry`** targets `https://npm.pkg.github.com`.
- **CI / publish** workflows check out [Agentfuse](https://github.com/jayavibhavnk/AgentFuse---ACP) next to Pnyx so `file:../agentfuse` resolves on the runner (git installs of Agentfuse omit `src/` because of its `files` field).

## 0.2.0

- **Compatibility:** Core package has **no runtime dependency** on Agentfuse. Install `agentfuse` only when you use the bridge.
- **Subpath** `…/agentfuse` exports `appendFromFuseMessage` and `mergePrompt` (re-exported for convenience).
- **Peer dependency** `agentfuse` is **optional** (`peerDependenciesMeta.optional`).
- **Package:** `sideEffects: false`, explicit `exports` map for bundlers (Vite, Webpack, esbuild, Rollup).

## 0.1.0

- Initial release: `SharedMemory`, `AssemblyRegistry`, Agentfuse bridge (`appendFromFuseMessage`, `mergePrompt`).
