import { SharedMemory } from "./memory.js";

/**
 * In-process registry so different modules can attach to the same task id.
 * For multi-process sharing, persist entries via your own store and hydrate.
 */
export class AssemblyRegistry {
  private readonly tasks = new Map<string, SharedMemory>();

  getOrCreate(taskId: string): SharedMemory {
    let mem = this.tasks.get(taskId);
    if (!mem) {
      mem = new SharedMemory();
      this.tasks.set(taskId, mem);
    }
    return mem;
  }

  has(taskId: string): boolean {
    return this.tasks.has(taskId);
  }

  /** Remove when the task is fully done (optional GC). */
  release(taskId: string): void {
    this.tasks.delete(taskId);
  }

  clear(): void {
    this.tasks.clear();
  }
}
