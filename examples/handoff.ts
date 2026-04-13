/**
 * Two-phase handoff: first agent (simulated) leaves notes in SharedMemory;
 * second phase builds a prompt for Agentfuse with that context.
 *
 * Usage (after `npm run build` in repo root and in ../agentfuse):
 *   node --experimental-strip-types examples/handoff.ts [providerId]
 *
 * Requires a supported CLI on PATH for the second phase (default: claude).
 */
import { createBackend, detectOne } from "agentfuse";
import { AssemblyRegistry, mergePrompt } from "../dist/index.js";

async function main(): Promise<void> {
  const taskId = "demo-auth-refactor";
  const registry = new AssemblyRegistry();
  const mem = registry.getOrCreate(taskId);

  // Stand-in for "first agent" — could be another process writing the same taskId.
  mem.append("system", "You are helping refactor authentication.");
  mem.append("user", "Move session checks into middleware; keep tests green.");
  mem.append(
    "assistant",
    "Plan: (1) extract requireSession, (2) update routes, (3) run vitest.",
    { agent: "planner" },
  );

  const followUp =
    "Implement step 1 only. Show the diff summary when done.";

  const prompt = mergePrompt(mem.toPromptBlock(), followUp);

  const providerId = (process.argv[2] as "claude" | undefined) ?? "claude";
  const detected = await detectOne(providerId);
  if (!detected) {
    console.error(`No CLI found for provider "${providerId}".`);
    console.error("Shared memory transcript built OK:\n");
    console.log(prompt.slice(0, 2000));
    process.exit(1);
  }

  const backend = createBackend(detected.providerId, {
    executablePath: detected.path,
  });

  const handle = backend.execute(prompt, { maxTurns: 4 });
  for await (const msg of handle.messages) {
    if (msg.type === "text" && msg.content) {
      process.stdout.write(msg.content);
    }
  }
  const result = await handle.result;
  console.error("\n---\nstatus:", result.status, "ms:", result.durationMs);
  if (result.status !== "completed") {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
