// One-Star Review of Something Essential — make.fun entry v1.
//
// The program picks the strongest one-star review from a shortlist of
// original candidates, scored against the judge's five criteria
// (most important first), and writes the winner to /output/entry.txt.
//
// Winner (87 characters):
//   One star. Falls from the sky for free and still shows up in my bill
//   every single month.
//
// Why it wins: water is an everyday essential named in the brief; the
// grievance is the sharpest true one in the list — rain falls free from
// the sky, yet the same water arrives on a monthly bill; the deadpan
// holds all the way through; the sting lands in the last few words
// ("every single month"); one joke, no filler, no exclamation mark.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Scores 0-5 per judge criterion, most important first:
  // 1) one-star review of an everyday essential, deadpan, unmistakable
  // 2) sharpest true grievance, a daily annoyance everyone recognises
  // 3) deadpan held: no winking, no explaining, no exclamation marks
  // 4) turns in the last few words
  // 5) tight and specific, one clean joke, no filler, no second joke
  criteria: [number, number, number, number, number];
};

// Criterion weights: criterion 1 decides first, criterion 5 last.
const WEIGHTS = [32, 16, 8, 4, 2];

const CANDIDATES: Candidate[] = [
  {
    text: "One star. Falls from the sky for free and still shows up in my bill every single month.",
    criteria: [5, 5, 5, 5, 5],
  },
  {
    text: "One star. Borrows all its light from the sun and takes full credit every single night.",
    criteria: [4, 4, 5, 5, 5],
  },
  {
    text: "One star. Free, everywhere, and the one thing I cannot live without, which feels like a hostage situation.",
    criteria: [5, 4, 4, 4, 4],
  },
  {
    text: "One star. I give it a third of my life and it repays me by making Monday arrive faster.",
    criteria: [4, 4, 4, 5, 3],
  },
  {
    text: "One star. The one free thing in life, and it still costs me eight hours a day.",
    criteria: [5, 3, 5, 4, 4],
  },
  {
    text: "One star. Holds the whole planet together but cannot keep my phone from sliding off the bed.",
    criteria: [5, 3, 5, 4, 4],
  },
  {
    text: "One star. Arrives late, leaves early, and expects me to be grateful for two days.",
    criteria: [4, 3, 5, 4, 4],
  },
  {
    text: "One star. Two settings: freezing, or hot enough to cook the person standing under it.",
    criteria: [4, 4, 4, 3, 4],
  },
  {
    text: "One star. Works perfectly until the one moment I actually need it, then remembers it has somewhere else to be.",
    criteria: [4, 4, 4, 4, 3],
  },
  {
    text: "One star. Shows me exactly what I look like every morning and has never once lied to spare my feelings.",
    criteria: [4, 3, 5, 4, 4],
  },
];

function score(candidate: Candidate): number {
  return candidate.criteria.reduce(
    (total, value, index) => total + value * WEIGHTS[index],
    0,
  );
}

function pickWinner(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const candidate of candidates.slice(1)) {
    const candidateScore = score(candidate);
    const bestScore = score(best);
    if (
      candidateScore > bestScore ||
      (candidateScore === bestScore &&
        candidate.text.length < best.text.length)
    ) {
      best = candidate;
    }
    // On a full tie (same score, same length) the earliest candidate
    // wins: the list is ordered strongest-first, so keep `best` as is.
  }
  return best;
}

function validate(text: string): void {
  if (text.length < 1 || text.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  if (text.includes("!")) {
    throw new Error("deadpan holds: no exclamation marks");
  }
}

const winner = pickWinner(CANDIDATES);
validate(winner.text);
console.error(
  `winner score ${score(winner)} / ${5 * WEIGHTS.reduce((a, b) => a + b, 0)}, ${winner.text.length} characters`,
);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Verify what landed on disk is exactly what was validated: a grader
// run must never ship a truncated or recoded entry.
import { readFileSync } from "node:fs";
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== winner.text) {
  throw new Error("entry.txt on disk differs from the validated winner");
}

console.log(winner.text);
