// File: lib/client/search.ts
import { CreatePromptObject } from "../types";

export const createPrompt = async (
  embedding: number[],
  exInput: string,
  exOutput: string,
  problem: string,
  user: string
) => {
  const res = await fetch("/api/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embedding,
      exInput,
      exOutput,
      problem,
      user,
    }),
  });
  const data = await res.json();
  return data as CreatePromptObject;
};
