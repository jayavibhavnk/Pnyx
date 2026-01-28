/**
 * Roles mirror a loose chat transcript so handoffs map cleanly onto prompts.
 */
export type MemoryRole = "system" | "user" | "assistant" | "tool";

export interface MemoryEntry {
  /** Monotonic id within this SharedMemory instance */
  id: string;
  /** Milliseconds since Unix epoch */
  ts: number;
  role: MemoryRole;
  content: string;
  /** Optional provenance (provider id, tool name, etc.) */
  meta?: Record<string, unknown>;
}
