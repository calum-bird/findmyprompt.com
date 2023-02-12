// File: pages/api/cache/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { BooleanObject } from "../../../lib/types";

const EMBEDDING_CACHE_URL = process.env.EMBEDDING_CACHE_URL;
const redis = new Redis(EMBEDDING_CACHE_URL ? EMBEDDING_CACHE_URL : "");

export default async function postCache(
  req: NextApiRequest,
  res: NextApiResponse<BooleanObject>
) {
  // Post only
  if (req.method !== "POST") {
    let returnObj: BooleanObject = {
      type: "boolean-error",
      data: { success: null, error: "Method not allowed" },
    };
    res.status(405).json(returnObj);
    return;
  }

  const {
    user,
    hashedProblem,
    embedding,
  }: { user: string; hashedProblem: string; embedding: number[] } = req.body;

  // turn embedding into string
  const embeddingString = embedding.join(",");
  const result = await redis.set(hashedProblem, embeddingString);

  // Make it typesafe and return the correct object
  let returnObj: BooleanObject;
  if (result && result === "OK") {
    returnObj = {
      type: "boolean-success",
      data: { success: true, error: null },
    };
  } else if (result && result !== "OK") {
    returnObj = {
      type: "boolean-failure",
      data: { success: false, error: null },
    };
  } else {
    returnObj = {
      type: "boolean-error",
      data: { success: null, error: "Unknown error" },
    };
  }

  res.status(200).json(returnObj);
}
