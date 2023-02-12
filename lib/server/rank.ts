// File: lib/server/rank.ts
import { PromptIndexObject } from "../types";

const logarithmicDecay = (x: number) => {
  const val = 0.01 / Math.log(x + 1);

  // If the value is too small, return 0
  if (val < 0.01) {
    return 0;
  } else if (val > 1) {
    return 1;
  }

  return val;
};

export const promptComparator = (
  a: PromptIndexObject,
  b: PromptIndexObject
) => {
  const aScore = logarithmicDecay(a.similarityScore) + a.keywordScore;
  const bScore = logarithmicDecay(b.similarityScore) + b.keywordScore;

  return bScore - aScore;
};
