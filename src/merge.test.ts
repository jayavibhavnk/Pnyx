import { describe, expect, it } from "vitest";
import { mergePrompt } from "./merge.js";

describe("mergePrompt", () => {
  it("returns instruction when shared is empty", () => {
    expect(mergePrompt("", "  hi  ")).toBe("hi");
  });

  it("returns shared when instruction is empty", () => {
    expect(mergePrompt("a", "")).toBe("a");
  });

  it("joins with blank line", () => {
    expect(mergePrompt("x", "y")).toBe("x\n\ny");
  });
});
