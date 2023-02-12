// File: lib/client/embed.ts
import { getCache, setCache } from "./cache";
import { EmbeddingObject } from "../types";

export const _getOpenAIEmbedding = async (
  problem: string,
  user: string
): Promise<EmbeddingObject> => {
  const res = await fetch("/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem,
      user,
    }),
  });
  const data = await res.json();
  return data as EmbeddingObject;
};

export const getEmbedding = async (
  problem: string,
  user: string
): Promise<number[]> => {
  const cachedResult = await getCache(problem);
  if (cachedResult.type !== "cache-hit") {
    if (cachedResult.type !== "cache-miss") {
      // Panic!
      throw new Error(cachedResult.data.error);
    }

    // Cache miss, so we need to get the embedding from OpenAI
    let embedding = await _getOpenAIEmbedding(problem, user);
    if (embedding.type !== "embedding-success") {
      // Panic!
      throw new Error(embedding.data.error);
    }

    // Set the cache now that we have the embedding
    await setCache(embedding.data.embedding, problem, user);

    // Finally, return it!
    return embedding.data.embedding;
  }

  // Cache hit, so we can just return the embedding
  return cachedResult.data.result;
};
