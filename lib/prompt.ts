import { CreatePromptObject } from "./types";

export const generatePrompt = async (
  problem: string,
  exInput: string,
  exOutput: string
): Promise<CreatePromptObject> => {
  const response = await fetch(`/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem,
      exInput,
      exOutput,
    }),
  });
  const result = await response.json();
  return result;
};
