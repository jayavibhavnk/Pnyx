# Pnyx

**Pnyx** (Greek *Πνύξ*) was the hill in ancient Athens where the *ekklēsia* assembled — citizens spoke in turn, and what was said became the shared record of the city’s work. This library is that idea for **coding agents**: a **shared memory layer** so multiple agents (or multiple turns) can **hand off context mid-task**, built on [**Agentfuse**](https://github.com/jayavibhavnk/AgentFuse---ACP).

Pnyx is **not** Multica. It is a small, standalone package you can embed in runners, IDEs, or orchestrators.

---

## Why

- **One transcript per task** — append-only entries with roles (`system`, `user`, `assistant`, `tool`).
- **Live handoffs** — `subscribe()` for the moment another agent adds context.
- **Same-process sharing** — `AssemblyRegistry` maps a `taskId` to one `SharedMemory` instance.
- **Agentfuse bridge (optional)** — import from `pnyx/agentfuse` to fold streaming CLI output into the transcript; `mergePrompt()` is also on the core entry.

Upstream CLIs remain **separate installs** (Agentfuse). Pnyx does not ship them.

---

## Compatibility

| Concern | Details |
|--------|---------|
| **Runtime** | **Node.js 20+** (ESM). Tested with current Node LTS. |
| **Module format** | **ESM only** (`"type": "module"`). Use `import`, not `require`. |
| **Agentfuse** | **Optional peer** — install `agentfuse` only if you use `import { appendFromFuseMessage } from "pnyx/agentfuse"`. Core memory APIs need no other packages. |
| **Package managers** | **npm**, **pnpm**, **Yarn** (Berry and classic) — `peerDependenciesMeta.optional` avoids spurious install warnings when you skip Agentfuse. |
| **Bundlers** | **`exports`** + **`sideEffects: false`** for tree-shaking in Vite, Webpack 5, Rollup, esbuild. |
| **TypeScript** | **≥5** recommended; types ship in `dist/*.d.ts`. |

---

## Install

**Memory + registry only** (no Agentfuse):

```bash
npm install pnyx
```

**With Agentfuse bridge** (CLI orchestration):

```bash
npm install pnyx agentfuse
```

Local development in this repo uses `file:../agentfuse` as a dev dependency.

---

## Quick start

```typescript
import { AssemblyRegistry, mergePrompt } from "pnyx";

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
| `SharedMemory` | `pnyx` | Append, `read`, `readAfter`, `subscribe`, `toPromptBlock` |
| `AssemblyRegistry` | `pnyx` | `getOrCreate(taskId)`, `release`, `clear` |
| `mergePrompt` | `pnyx` or `pnyx/agentfuse` | Concatenate shared block + next instruction |
| `appendFromFuseMessage` | `pnyx/agentfuse` | Mirror Agentfuse `Message` stream into memory |

```typescript
import { appendFromFuseMessage } from "pnyx/agentfuse";
```

---

## Scripts

```bash
npm install
npm run build   # requires ../agentfuse built: (cd ../agentfuse && npm run build)
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
