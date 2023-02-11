import { PromptIndexObject } from "./types";

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
  const similarityFactorA = logarithmicDecay(a.data.similarityScore);
  const nGramFactorA = a.data.keywordScore;
  const aScore = similarityFactorA + nGramFactorA;

  const similarityFactorB = logarithmicDecay(b.data.similarityScore);
  const nGramFactorB = b.data.keywordScore;
  const bScore = similarityFactorB + nGramFactorB;

  return bScore - aScore;
};
