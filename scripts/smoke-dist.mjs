/**
 * Quick check that `dist/` loads and mergePrompt works (no Agentfuse CLI).
 * Run after `npm run build`.
 */
import { AssemblyRegistry, mergePrompt } from "../dist/index.js";

const r = new AssemblyRegistry();
const mem = r.getOrCreate("smoke");
mem.append("user", "hello");
const p = mergePrompt(mem.toPromptBlock(), "next");
if (!p.includes("<shared_memory>") || !p.includes("next")) {
  console.error("smoke: unexpected prompt shape");
  process.exit(1);
}
console.log("smoke: ok");
