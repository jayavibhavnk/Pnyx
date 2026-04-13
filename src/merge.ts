/**
 * Build a single prompt string: shared transcript block + next instruction.
 * Zero dependencies — safe to import from core `pnyx` without Agentfuse.
 */
export function mergePrompt(sharedBlock: string, instruction: string): string {
  const s = sharedBlock.trim();
  const i = instruction.trim();
  if (!s) {
    return i;
  }
  if (!i) {
    return s;
  }
  return `${s}\n\n${i}`;
}
