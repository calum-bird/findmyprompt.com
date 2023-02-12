// File: pages/api/prompt/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { GetPromptObject, PromptObject } from "../../../lib/types";

import { getPrompt as getSinglePrompt } from "../../../lib/server/db/planetscale";

export default async function getPrompt(
  req: NextApiRequest,
  res: NextApiResponse<GetPromptObject>
) {
  if (req.method !== "GET") {
    let createPromptObject: GetPromptObject = {
      type: "get-prompt-failure",
      data: { error: "Method not allowed", promptObject: null },
    };
    res.status(405).json(createPromptObject);
    return;
  }

  const { promptId } = req.query;

  // Check for invalid prompt ID
  if (!promptId || typeof promptId !== "string") {
    let createPromptObject: GetPromptObject = {
      type: "get-prompt-failure",
      data: { error: "Invalid prompt ID.", promptObject: null },
    };
    res.status(400).json(createPromptObject);
    return;
  }

  let row = await getSinglePrompt(promptId);

  let promptObject: PromptObject = {
    id: "0",
    problem: "test",
    prompt: `This is a test prompt for blank and blank`,
  };

  let getPromptObject: GetPromptObject = {
    type: "get-prompt-success",
    data: { error: null, promptObject: promptObject },
  };

  res.status(200).json(getPromptObject);
}
