// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenerationParams, LMResponseObject } from "../../lib/types";

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

  const generationParams = req.body as GenerationParams;

  // fetch openai api using helicone.ai for logs
  const result = await fetch("https://oai.hconeai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generationParams),
  }).then((res) => {
    return res.json();
  });

  let responseObj: LMResponseObject;
  if (result.choices && result.choices.length > 0) {
    let lmResponse = {
      model: result.model,
      prompt: result.prompt,
      choices: result.choices.map((choice: any) => choice.text),
    };

    responseObj = {
      type: "lm-response-success",
      data: {
        error: null,
        lmResponse: lmResponse,
      },
    };
  } else {
    responseObj = {
      type: "lm-response-failure",
      data: {
        error: result.error.message,
        lmResponse: null,
      },
    };
  }

  res.status(200).json(responseObj);
}
