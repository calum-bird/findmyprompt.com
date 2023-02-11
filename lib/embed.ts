import { EmbeddingObject } from "./types";

export const getEmbedding = async (
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
