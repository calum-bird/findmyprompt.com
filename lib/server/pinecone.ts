// File: lib/server/pinecone.ts

import { EmbeddingSearchResult, PineconeEmbedding } from "../types";

const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeApiBase = process.env.PINECONE_API_BASE_URL;
if (pineconeApiKey === undefined) {
  throw new Error("PINECONE_API_KEY env var not set.");
}
if (pineconeApiBase === undefined) {
  throw new Error("PINECONE_API_URL env var not set.");
}

export const upsertVector = async (
  embedding: number[],
  promptId: string
): Promise<void> => {
  let pineconeBody = {
    vectors: [
      {
        id: promptId,
        values: embedding,
      },
    ],
  };
  const res = await fetch(`${pineconeApiBase}/vectors/upsert`, {
    method: "POST",
    headers: {
      "Api-Key": pineconeApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pineconeBody),
  });
  let data = await res.json();
  console.log(data);
};

export const getSimilarVectors = async (
  problemEmbeddingVector: number[]
): Promise<EmbeddingSearchResult> => {
  const res = await fetch(`${pineconeApiBase}/query`, {
    method: "POST",
    headers: {
      "Api-Key": pineconeApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vector: problemEmbeddingVector,
      topK: 20,
      includeMetadata: true,
    }),
  });
  const data = await res.json();

  let resultObj: EmbeddingSearchResult;
  if (data) {
    let pineconeEmbeddings = data.matches as PineconeEmbedding[];
    resultObj = {
      type: "embedding-search-success",
      data: { error: null, searchResults: pineconeEmbeddings },
    };
  } else {
    resultObj = {
      type: "embedding-search-failure",
      data: {
        error: "Failed to search for similar vectors",
        searchResults: null,
      },
    };
  }

  return resultObj;
};
