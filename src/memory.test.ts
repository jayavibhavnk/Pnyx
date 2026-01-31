import { describe, expect, it, vi } from "vitest";
import { SharedMemory } from "./memory.js";

describe("SharedMemory", () => {
  it("appends and reads in order", () => {
    const m = new SharedMemory();
    const a = m.append("user", "hello");
    const b = m.append("assistant", "hi");
    expect(m.read().map((e) => e.content)).toEqual(["hello", "hi"]);
    expect(a.id).not.toBe(b.id);
  });

  it("readAfter returns entries after id", () => {
    const m = new SharedMemory();
    const first = m.append("user", "a");
    m.append("assistant", "b");
    const after = m.readAfter(first.id);
    expect(after).toHaveLength(1);
    expect(after[0]?.content).toBe("b");
  });

  it("readAfter unknown id returns full transcript", () => {
    const m = new SharedMemory();
    m.append("user", "only");
    const after = m.readAfter("unknown-id");
    expect(after).toHaveLength(1);
  });

  it("notifies subscribers", () => {
    const m = new SharedMemory();
    const fn = vi.fn();
    m.subscribe(fn);
    m.append("user", "x");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0]?.[0]?.content).toBe("x");
  });

  it("toPromptBlock wraps entries", () => {
    const m = new SharedMemory();
    m.append("user", "task");
    const block = m.toPromptBlock();
    expect(block).toContain("<shared_memory>");
    expect(block).toContain("</USER>");
    expect(block).toContain("task");
  });
});
