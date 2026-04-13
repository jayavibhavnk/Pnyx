import type { Message } from "agentfuse";
import type { SharedMemory } from "./memory.js";

/**
 * Project streaming Agentfuse messages into the shared transcript so the next
 * agent (or the same agent on the next turn) sees tool use and text.
 */
export function appendFromFuseMessage(
  mem: SharedMemory,
  m: Message,
  meta?: { providerId?: string },
): void {
  const base = meta?.providerId
    ? { providerId: meta.providerId }
    : undefined;

  switch (m.type) {
    case "text":
      if (m.content) {
        mem.append("assistant", m.content, { ...base, fuseType: m.type });
      }
      break;
    case "thinking":
      if (m.content) {
        mem.append("assistant", m.content, {
          ...base,
          fuseType: m.type,
          kind: "thinking",
        });
      }
      break;
    case "tool-use": {
      const label = m.tool ?? "tool";
      const payload = m.input !== undefined ? JSON.stringify(m.input) : "";
      mem.append("assistant", `[${label}] ${payload}`, {
        ...base,
        fuseType: m.type,
        tool: m.tool,
        callId: m.callId,
      });
      break;
    }
    case "tool-result":
      if (m.output !== undefined) {
        mem.append("tool", m.output, {
          ...base,
          fuseType: m.type,
          tool: m.tool,
          callId: m.callId,
        });
      }
      break;
    case "error":
      if (m.content) {
        mem.append("assistant", `[error] ${m.content}`, {
          ...base,
          fuseType: m.type,
        });
      }
      break;
    case "status":
    case "log":
      if (m.content) {
        mem.append("assistant", m.content, {
          ...base,
          fuseType: m.type,
          level: m.level,
          status: m.status,
        });
      }
      break;
    default:
      break;
  }
}
