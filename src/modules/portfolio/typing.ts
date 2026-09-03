/**
 * The typewriter's clock and cursor arithmetic, kept pure so the timing is
 * unit-testable without a DOM. `TypedLines` is the thin renderer that applies
 * `nextTypingState` on a timer — the loop is a two-state machine (typing ⇄
 * deleting) rather than a chain of nested timeouts.
 */

export type TypingPhase = "typing" | "deleting";

export interface TypingState {
  readonly typed: number;
  readonly phase: TypingPhase;
}

/**
 * Milliseconds. The finished name is the resting state — it holds far longer
 * than any other phase, so the loop reads as an occasional flourish rather than
 * a ticker. Deleting still outpaces typing, the way a held backspace does, but
 * not so fast that the name snaps away.
 */
export const TYPING_TIMING = {
  key: 70,
  backspace: 55,
  /** Beat at the end of a line, before the next one starts. */
  lineBreak: 340,
  /** The finished name sits before it is erased. */
  hold: 4200,
  /** Blank, before it types itself again. */
  restart: 1500,
} as const;

export function totalLength(lines: readonly string[]): number {
  return lines.reduce((sum, line) => sum + line.length, 0);
}

/** How much of `lines[index]` `typed` characters have reached. */
export function typedPrefix(
  lines: readonly string[],
  index: number,
  typed: number,
): string {
  const line = lines[index] ?? "";
  const before = totalLength(lines.slice(0, index));

  return line.slice(0, Math.min(Math.max(typed - before, 0), line.length));
}

/** The line the cursor sits on: the one being typed, or the last once finished. */
export function caretLine(lines: readonly string[], typed: number): number {
  let seen = 0;

  for (const [index, line] of lines.entries()) {
    seen += line.length;
    if (typed <= seen) return index;
  }

  return lines.length - 1;
}

function endsALine(lines: readonly string[], typed: number): boolean {
  let seen = 0;

  for (const line of lines) {
    seen += line.length;
    if (typed === seen) return true;
  }

  return false;
}

/** One step of the loop: what to show next, and how long to wait before it. */
export function nextTypingState(
  state: TypingState,
  lines: readonly string[],
): { readonly state: TypingState; readonly delay: number } {
  const total = totalLength(lines);

  if (state.phase === "typing") {
    if (state.typed >= total) {
      return { state: { typed: total, phase: "deleting" }, delay: TYPING_TIMING.hold };
    }

    return {
      state: { typed: state.typed + 1, phase: "typing" },
      delay: endsALine(lines, state.typed) ? TYPING_TIMING.lineBreak : TYPING_TIMING.key,
    };
  }

  if (state.typed <= 0) {
    return { state: { typed: 0, phase: "typing" }, delay: TYPING_TIMING.restart };
  }

  return {
    state: { typed: state.typed - 1, phase: "deleting" },
    delay: TYPING_TIMING.backspace,
  };
}
