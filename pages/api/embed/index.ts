// File: pages/api/search/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { EmbeddingObject } from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmbeddingObject>
) {
  if (req.method !== "POST") {
    res.status(405).json({
      type: "embedding-failure",
      data: { error: "Invalid method.", embedding: null },
    });
    return;
  }

  const { user, problem } = req.body;

  // fetch openai api using helicone.ai for logs
  const result = await fetch("https://oai.hconeai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: problem,
      user: user,
    }),
  }).then((res) => {
    return res.json();
  });

  console.log(result);

  let resultObj: EmbeddingObject;
  if (result) {
    resultObj = {
      type: "embedding-success",
      data: { error: null, embedding: result.data[0].embedding },
    };
  } else {
    resultObj = {
      type: "embedding-failure",
      data: { error: "Failed to generate embedding", embedding: null },
    };
  }

  res.status(200).json(resultObj);
}
