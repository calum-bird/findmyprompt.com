// File: pages/api/prompt/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import {
  CreatePromptObject,
  GenerationParams,
  PromptObject,
} from "../../../lib/types";
import { buildMetaPrompt } from "../../../lib/server/prompts";
import generate from "../../../lib/server/llm/generate";
import { v4 as uuidv4 } from "uuid";
import { addPrompt, getAllPrompts } from "../../../lib/server/db/planetscale";
import { upsertVector } from "../../../lib/server/pinecone";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreatePromptObject>
) {
  if (req.method !== "POST") {
    let createPromptObject: CreatePromptObject = {
      type: "create-prompt-failure",
      data: { error: "Method not allowed", promptObject: null },
    };
    res.status(405).json(createPromptObject);
    return;
  }

  const { embedding, exInput, exOutput, problem, user } = req.body;
  const createPromptObject = await generatePrompt(
    embedding,
    exInput,
    exOutput,
    problem,
    user
  );

  res.status(200).json(createPromptObject);
}

const generatePrompt = async (
  embedding: number[],
  exInput: string,
  exOutput: string,
  problem: string,
  user: string
): Promise<CreatePromptObject> => {
  const prompt = buildMetaPrompt(problem, exInput, exOutput);
  const generationParams: GenerationParams = {
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1024,
    stop: ["==="],
  };
  const provider = "openai";
  const result = await generate(generationParams, provider);

  // Check for errors in the generation
  if (result.type === "lm-response-failure") {
    let createPromptObject: CreatePromptObject = {
      type: "create-prompt-failure",
      data: { error: result.data.error, promptObject: null },
    };
    return createPromptObject;
  }

  let reultantPrompt = "Can you help" + result.data.lmResponse.choices[0];
  let promptId = uuidv4();
  let promptObject: PromptObject = {
    id: promptId,
    problem: problem,
    prompt: reultantPrompt,
  };

  // persist to PlanetScale in the background
  let rowsAffected = await addPrompt(promptObject, user);

  // Upsert our problem embedding to Pinecone
  let upserted = await upsertVector(embedding, promptId);

  let createPromptObject: CreatePromptObject = {
    type: "create-prompt-success",
    data: { error: null, promptObject: promptObject },
  };

  return createPromptObject;
};
