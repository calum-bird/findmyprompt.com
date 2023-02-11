// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CreatePromptObject, PromptObject } from "../../lib/types";

export default async function postPrompt(
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

  const { user, problem, prompt } = req.body;

  let promptObject: PromptObject = {
    id: "0",
    problem: "test",
    prompt: `This is a test prompt for blank and blank`,
  };

  let createPromptObject: CreatePromptObject = {
    type: "create-prompt-success",
    data: { error: null, promptObject: promptObject },
  };
  res.status(200).json(createPromptObject);
}
