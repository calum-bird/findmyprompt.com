// File: lib/client/search.ts
import { SearchResult } from "../types";

export const search = async (
  embedding: number[],
  problem: string,
  user: string
) => {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem,
      problemEmbedding: embedding,
      user,
    }),
  });
  const data = await res.json();
  return data as SearchResult;
};
