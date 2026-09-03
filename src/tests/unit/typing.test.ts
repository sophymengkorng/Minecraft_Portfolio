import { describe, expect, it } from "vitest";
import {
  TYPING_TIMING,
  caretLine,
  nextTypingState,
  totalLength,
  typedPrefix,
  type TypingState,
} from "@/modules/portfolio/typing";

const LINES = ["SOMONOR", "HONG"] as const;
const TOTAL = 11;

describe("typedPrefix", () => {
  it("fills the first line before the second starts", () => {
    expect(typedPrefix(LINES, 0, 4)).toBe("SOMO");
    expect(typedPrefix(LINES, 1, 4)).toBe("");
  });

  it("carries the count over the line break", () => {
    expect(typedPrefix(LINES, 0, 9)).toBe("SOMONOR");
    expect(typedPrefix(LINES, 1, 9)).toBe("HO");
  });

  it("clamps at both ends", () => {
    expect(typedPrefix(LINES, 1, 0)).toBe("");
    expect(typedPrefix(LINES, 1, 99)).toBe("HONG");
  });
});

describe("caretLine", () => {
  it("stays on a line until its last character is typed", () => {
    expect(caretLine(LINES, 0)).toBe(0);
    expect(caretLine(LINES, 7)).toBe(0);
    expect(caretLine(LINES, 8)).toBe(1);
    expect(caretLine(LINES, TOTAL)).toBe(1);
  });
});

describe("nextTypingState", () => {
  it("types one character at a time", () => {
    expect(nextTypingState({ typed: 2, phase: "typing" }, LINES)).toEqual({
      state: { typed: 3, phase: "typing" },
      delay: TYPING_TIMING.key,
    });
  });

  it("beats at the line break", () => {
    expect(nextTypingState({ typed: 7, phase: "typing" }, LINES).delay).toBe(
      TYPING_TIMING.lineBreak,
    );
  });

  it("holds the finished name, then erases it", () => {
    expect(nextTypingState({ typed: TOTAL, phase: "typing" }, LINES)).toEqual({
      state: { typed: TOTAL, phase: "deleting" },
      delay: TYPING_TIMING.hold,
    });
  });

  it("backspaces faster than it types", () => {
    expect(nextTypingState({ typed: 5, phase: "deleting" }, LINES)).toEqual({
      state: { typed: 4, phase: "deleting" },
      delay: TYPING_TIMING.backspace,
    });
  });

  it("pauses on empty, then starts over", () => {
    expect(nextTypingState({ typed: 0, phase: "deleting" }, LINES)).toEqual({
      state: { typed: 0, phase: "typing" },
      delay: TYPING_TIMING.restart,
    });
  });

  it("returns to its own starting state after a full cycle", () => {
    let state: TypingState = { typed: TOTAL, phase: "typing" };
    const seen: number[] = [];

    for (let step = 0; step < 64; step += 1) {
      state = nextTypingState(state, LINES).state;
      seen.push(state.typed);
      if (state.typed === TOTAL && state.phase === "typing") break;
    }

    expect(Math.min(...seen)).toBe(0);
    expect(state).toEqual({ typed: TOTAL, phase: "typing" });
  });
});

describe("totalLength", () => {
  it("counts every line", () => {
    expect(totalLength(LINES)).toBe(TOTAL);
  });
});
