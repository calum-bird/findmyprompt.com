// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { CacheObject } from "../../../lib/types";

const EMBEDDING_CACHE_URL = process.env.EMBEDDING_CACHE_URL;
const redis = new Redis(EMBEDDING_CACHE_URL ? EMBEDDING_CACHE_URL : "");

export default async function getCache(
  req: NextApiRequest,
  res: NextApiResponse<CacheObject>
) {
  // Get only
  if (req.method !== "GET") {
    let returnObj: CacheObject = {
      type: "cache-error",
      data: { result: null, error: "Method not allowed" },
    };
    res.status(405).json(returnObj);
    return;
  }

  let { hashedProblem } = req.query;
  if (!hashedProblem) {
    let returnObj: CacheObject = {
      type: "cache-error",
      data: {
        result: null,
        error:
          "Invalid query params. Please provide a 'hashedProblem' query param",
      },
    };
    res.status(400).json(returnObj);
    return;
  }

  // Ensure type safety for query params
  hashedProblem = Array.isArray(hashedProblem)
    ? hashedProblem[0]
    : hashedProblem;

  // check redis cache for hashed query text
  const result = await redis.get(hashedProblem);
  const type = result ? "cache-hit" : "cache-miss";

  let numResult: number[] = [];
  if (result) {
    numResult = result.split(",").map((x) => parseFloat(x));
  }

  // Ensure correct types
  let cacheObject: CacheObject;
  if (type === "cache-hit") {
    cacheObject = {
      type: "cache-hit",
      data: {
        result: numResult,
        error: null,
      },
    };
  } else if (type === "cache-miss") {
    cacheObject = {
      type: "cache-miss",
      data: {
        result: null,
        error: null,
      },
    };
  } else {
    cacheObject = {
      type: "cache-error",
      data: {
        result: null,
        error: "Unknown error",
      },
    };
  }

  res.status(200).json(cacheObject);
}
