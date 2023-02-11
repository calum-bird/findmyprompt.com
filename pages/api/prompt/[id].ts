// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GetPromptObject, PromptObject } from "../../../lib/types";

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

  const { user, hashedProblem } = req.body;

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
