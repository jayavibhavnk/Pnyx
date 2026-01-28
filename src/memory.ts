import { randomUUID } from "node:crypto";
import type { MemoryEntry, MemoryRole } from "./types.js";

export type MemoryListener = (entry: MemoryEntry) => void;

/**
 * Append-only shared transcript for a single task. Multiple agents can read and
 * write the same instance to hand off context mid-run.
 */
export class SharedMemory {
  private readonly entries: MemoryEntry[] = [];
  private readonly listeners = new Set<MemoryListener>();

  /** Total entries appended (for metrics); same as entries.length */
  get size(): number {
    return this.entries.length;
  }

  append(
    role: MemoryRole,
    content: string,
    meta?: Record<string, unknown>,
  ): MemoryEntry {
    const entry: MemoryEntry = {
      id: randomUUID(),
      ts: Date.now(),
      role,
      content,
      meta,
    };
    this.entries.push(entry);
    for (const fn of this.listeners) {
      fn(entry);
    }
    return entry;
  }

  /** Full snapshot, oldest first */
  read(): readonly MemoryEntry[] {
    return this.entries;
  }

  /**
   * Entries strictly after the given id (by list order). If id is unknown,
   * returns all entries.
   */
  readAfter(entryId: string): MemoryEntry[] {
    const idx = this.entries.findIndex((e) => e.id === entryId);
    if (idx < 0) {
      return [...this.entries];
    }
    return this.entries.slice(idx + 1);
  }

  subscribe(listener: MemoryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Compact block suitable for prefixing the next agent prompt.
   */
  toPromptBlock(): string {
    if (this.entries.length === 0) {
      return "";
    }
    const lines: string[] = [
      "<shared_memory>",
      "The following is prior work and messages from other agents on this task.",
    ];
    for (const e of this.entries) {
      const tag = e.role.toUpperCase();
      lines.push(`<${tag} id="${e.id}">`);
      lines.push(e.content.trim());
      lines.push(`</${tag}>`);
    }
    lines.push("</shared_memory>");
    return lines.join("\n");
  }
}
