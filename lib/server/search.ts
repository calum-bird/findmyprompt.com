// File: lib/server/search.ts

import { PromptIndexObject } from "../types";
import { getAllPrompts, getPrompts } from "./db/planetscale";
import { getSimilarVectors } from "./pinecone";

export const search = async (
  embedding: number[],
  problem: string,
  user: string
): Promise<PromptIndexObject[]> => {
  // Get nearest prompt embeddings from pinecone
  const similarityResults = await getSimilarVectors(embedding);
  if (similarityResults.type !== "embedding-search-success") {
    throw new Error(similarityResults.data.error);
  }

  // Sort by similarity score
  let nearestPromptEmbeddings = similarityResults.data.searchResults.sort(
    (a, b) => {
      return a.score - b.score;
    }
  );

  // Filter out those with less than 0.9 similarity score
  nearestPromptEmbeddings = nearestPromptEmbeddings.filter(
    (embedding) => embedding.score > 0.9
  );

  // Map prompt ids
  const nearestPromptIds = nearestPromptEmbeddings.map((pineconeEmbedding) => {
    return pineconeEmbedding.id;
  });

  // Get and return the full prompt objects from planetscale
  if (nearestPromptIds.length === 0) {
    return [];
  }
  const fullPrompts = await getPrompts(nearestPromptIds);

  // Append similarity score to each prompt object
  const fullPromptsWithScores: PromptIndexObject[] = fullPrompts.map(
    (prompt) => {
      const similarityScore = nearestPromptEmbeddings.find(
        (embedding) => embedding.id === prompt.id
      )?.score;

      if (similarityScore === undefined) {
        throw new Error("Could not find similarity score for prompt. Panic!");
      }

      return {
        prompt: prompt,
        similarityScore: similarityScore,
        keywordScore: 0,
      };
    }
  );

  return fullPromptsWithScores;
};
