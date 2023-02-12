// File: lib/cache.ts
import { sha256 } from "js-sha256";
import { BooleanObject, CacheObject } from "../types";

export const getCache = async (problem: string): Promise<CacheObject> => {
  let normalizedProblem = problem.toLowerCase().trim().replace(/\s+/g, " ");
  let hashedProblem = sha256(normalizedProblem);
  const res = await fetch(`/api/cache/${hashedProblem}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data as CacheObject;
};

export const setCache = async (
  embedding: number[],
  problem: string,
  user: string
): Promise<BooleanObject> => {
  let normalizedProblem = problem.toLowerCase().trim().replace(/\s+/g, " ");
  let hashedProblem = sha256(normalizedProblem);
  const res = await fetch(`/api/cache`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embedding,
      hashedProblem,
      user,
    }),
  });
  const data = await res.json();
  return data as BooleanObject;
};
