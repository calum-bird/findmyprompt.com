import { buildMetaPrompt } from "./prompts";
import {
  CreatePromptObject,
  GenerationParams,
  LMResponseObject,
  PromptObject,
} from "./types";

export const generatePrompt = async (
  problem: string,
  exInput: string,
  exOutput: string
): Promise<CreatePromptObject> => {
  let prompt = buildMetaPrompt(problem, exInput, exOutput);
  let generation: GenerationParams = {
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1024,
    stop: ["==="],
  };

  const response = await fetch(`/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generation),
  });
  const result = (await response.json()) as LMResponseObject;

  if (result.type === "lm-response-failure") {
    let createPromptObject: CreatePromptObject = {
      type: "create-prompt-failure",
      data: { error: result.data.error, promptObject: null },
    };
    return createPromptObject;
  }

  let reultantPrompt = "Can you help" + result.data.lmResponse.choices[0];

  // persist to db

  let promptObject: PromptObject = {
    id:
    problem: problem,
    prompt: "Can you help" + result.data.lmResponse.choices[0],
  };

  let createPromptObject: CreatePromptObject = {
    type: "create-prompt-success",
    data: { error: null, promptObject: result.data.lmResponse },
  };

  return createPromptObject;
};
