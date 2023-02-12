// File: pages/api/generate/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  GenerationParams,
  LMProvider,
  LMResponseObject,
} from "../../../lib/types";
import generate from "../../../lib/server/llm/generate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LMResponseObject>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    let responseObj: LMResponseObject = {
      type: "lm-response-failure",
      data: {
        error: "Method not allowed",
        lmResponse: null,
      },
    };
    res.status(405).json(responseObj);
    return;
  }

  let generationParams: GenerationParams = req.body.generationParams;
  let provider: LMProvider = req.body.provider;

  const result = await generate(generationParams, provider);

  res.status(200).json(result);
}
