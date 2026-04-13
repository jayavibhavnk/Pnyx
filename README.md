# Pnyx

**Pnyx** (Greek *Πνύξ*) was the hill in ancient Athens where the *ekklēsia* assembled — citizens spoke in turn, and what was said became the shared record of the city’s work. This library is that idea for **coding agents**: a **shared memory layer** so multiple agents (or multiple turns) can **hand off context mid-task**, built on [**Agentfuse**](https://github.com/jayavibhavnk/AgentFuse---ACP).

Pnyx is **not** Multica. It is a small, standalone package you can embed in runners, IDEs, or orchestrators.

---

## Why

- **One transcript per task** — append-only entries with roles (`system`, `user`, `assistant`, `tool`).
- **Live handoffs** — `subscribe()` for the moment another agent adds context.
- **Same-process sharing** — `AssemblyRegistry` maps a `taskId` to one `SharedMemory` instance.
- **Agentfuse bridge** — `appendFromFuseMessage()` folds streaming CLI output into the transcript; `mergePrompt()` prefixes the next prompt.

Upstream CLIs remain **separate installs** (Agentfuse). Pnyx does not ship them.

---

## Install

```bash
npm install pnyx
```

You also need **`agentfuse`** (peer-style dependency in your app). Local development in this repo uses `file:../agentfuse`.

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

| Export | Role |
|--------|------|
| `SharedMemory` | Append, `read`, `readAfter`, `subscribe`, `toPromptBlock` |
| `AssemblyRegistry` | `getOrCreate(taskId)`, `release`, `clear` |
| `appendFromFuseMessage(mem, message, { providerId })` | Mirror Agentfuse stream into memory |
| `mergePrompt(sharedBlock, instruction)` | Concatenate for the next run |

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
