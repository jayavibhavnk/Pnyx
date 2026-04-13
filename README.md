# Pnyx

**Pnyx** (Greek *Πνύξ*) was the hill in ancient Athens where the *ekklēsia* assembled — citizens spoke in turn, and what was said became the shared record of the city’s work. This library is that idea for **coding agents**: a **shared memory layer** so multiple agents (or multiple turns) can **hand off context mid-task**, built on [**Agentfuse**](https://github.com/jayavibhavnk/AgentFuse---ACP).

Pnyx is **not** Multica. It is a small, standalone package you can embed in runners, IDEs, or orchestrators.

The npm package name is **`@jayavibhavnk/pnyx`** (scoped for GitHub Packages).

---

## Why

- **One transcript per task** — append-only entries with roles (`system`, `user`, `assistant`, `tool`).
- **Live handoffs** — `subscribe()` for the moment another agent adds context.
- **Same-process sharing** — `AssemblyRegistry` maps a `taskId` to one `SharedMemory` instance.
- **Agentfuse bridge (optional)** — import from `@jayavibhavnk/pnyx/agentfuse` to fold streaming CLI output into the transcript; `mergePrompt()` is also on the core entry.

Upstream CLIs remain **separate installs** (Agentfuse). Pnyx does not ship them.

---

## Compatibility

| Concern | Details |
|--------|---------|
| **Runtime** | **Node.js 20+** (ESM). Tested with current Node LTS. |
| **Module format** | **ESM only** (`"type": "module"`). Use `import`, not `require`. |
| **Agentfuse** | **Optional peer** — install `agentfuse` only if you use `import { appendFromFuseMessage } from "@jayavibhavnk/pnyx/agentfuse"`. Core memory APIs need no other packages. |
| **Package managers** | **npm**, **pnpm**, **Yarn** (Berry and classic) — `peerDependenciesMeta.optional` avoids spurious install warnings when you skip Agentfuse. |
| **Bundlers** | **`exports`** + **`sideEffects: false`** for tree-shaking in Vite, Webpack 5, Rollup, esbuild. |
| **TypeScript** | **≥5** recommended; types ship in `dist/*.d.ts`. |
| **GitHub Packages** | Published as **`@jayavibhavnk/pnyx`** to `npm.pkg.github.com` (see below). |

---

## Install

### From the public npm registry (if published there)

```bash
npm install @jayavibhavnk/pnyx
```

### From GitHub Packages

1. Create a [Personal Access Token](https://github.com/settings/tokens) with at least **`read:packages`** (and **`write:packages`** only if you publish).

2. In your project, add an `.npmrc`:

```ini
@jayavibhavnk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

3. Set `NPM_TOKEN` in your environment (or CI secrets) to the PAT, then:

```bash
npm install @jayavibhavnk/pnyx
```

**With Agentfuse bridge** (CLI orchestration):

```bash
npm install @jayavibhavnk/pnyx agentfuse
```

Releases of this repo trigger a workflow that publishes to GitHub Packages when you **create a GitHub Release**.

---

## Quick start

```typescript
import { AssemblyRegistry, mergePrompt } from "@jayavibhavnk/pnyx";

const registry = new AssemblyRegistry();
const mem = registry.getOrCreate("issue-42");

mem.append("user", "Refactor the logger to use structured JSON.");
mem.append("assistant", "I will extract serializeLog() first.", {
  agent: "claude",
});

const prompt = mergePrompt(
  mem.toPromptBlock(),
  "Continue from the last assistant message.",
);
// Pass `prompt` to Agentfuse’s backend.execute(prompt, …)
```

---

## API

| Export | Module | Role |
|--------|--------|------|
| `SharedMemory` | `@jayavibhavnk/pnyx` | Append, `read`, `readAfter`, `subscribe`, `toPromptBlock` |
| `AssemblyRegistry` | `@jayavibhavnk/pnyx` | `getOrCreate(taskId)`, `release`, `clear` |
| `mergePrompt` | `@jayavibhavnk/pnyx` or `@jayavibhavnk/pnyx/agentfuse` | Concatenate shared block + next instruction |
| `appendFromFuseMessage` | `@jayavibhavnk/pnyx/agentfuse` | Mirror Agentfuse `Message` stream into memory |

```typescript
import { appendFromFuseMessage } from "@jayavibhavnk/pnyx/agentfuse";
```

---

## Contributing / local dev

This repo lists **`agentfuse` as `file:../agentfuse`**. Clone **both** repositories as **siblings**:

```text
your-workspace/
  agentfuse/    # https://github.com/jayavibhavnk/AgentFuse---ACP
  Pnyx/         # this repo
```

Then:

```bash
cd agentfuse && npm install && npm run build && cd ../Pnyx
npm install
npm run verify
```

---

## Scripts

```bash
npm install
npm run verify  # build + test + typecheck + smoke (no CLI required)
```

### Example

```bash
(cd ../agentfuse && npm run build)
npm run build
node --experimental-strip-types examples/handoff.ts claude
```

---

## Limits

- **In-process only** — `AssemblyRegistry` is not shared across machines. For distributed handoffs, persist `MemoryEntry` rows in your DB and rehydrate a `SharedMemory` (or build a small adapter — contributions welcome).
- **No encryption** — treat transcripts like any sensitive log.

---

## License

MIT — see [LICENSE](./LICENSE).
