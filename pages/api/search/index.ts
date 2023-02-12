// File: pages/api/search/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptIndexObject, SearchResult } from "../../../lib/types";
import { search } from "../../../lib/server/search";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult>
) {
  if (req.method !== "POST") {
    res.status(405).json({
      type: "search-result-failure",
      data: { error: "Invalid method.", searchResults: null },
    });
    return;
  }

  const { problem, problemEmbedding, user } = req.body;
  const result = await search(problemEmbedding, problem, user);
  if (result.length === 0) {
    res.status(200).json({
      type: "search-result-failure",
      data: { error: "No results found.", searchResults: null },
    });
    return;
  }

  res.status(200).json({
    type: "search-result-success",
    data: { error: null, searchResults: result },
  });
}
