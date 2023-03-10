// File: lib/types.ts

export type CacheHit = {
  type: "cache-hit";
  data: {
    result: number[];
    error: null;
  };
};

export type CacheMiss = {
  type: "cache-miss";
  data: {
    result: null;
    error: null;
  };
};

export type CacheError = {
  type: "cache-error";
  data: {
    result: null;
    error: string;
  };
};

export type CacheObject = CacheHit | CacheMiss | CacheError;

type BooleanSuccess = {
  type: "boolean-success";
  data: {
    success: true;
    error: null;
  };
};

type BooleanFailure = {
  type: "boolean-failure";
  data: {
    success: false;
    error: null;
  };
};

type BooleanError = {
  type: "boolean-error";
  data: {
    success: null;
    error: string;
  };
};

export type BooleanObject = BooleanSuccess | BooleanFailure | BooleanError;

type EmbeddingSuccess = {
  type: "embedding-success";
  data: {
    error: null;
    embedding: number[];
  };
};

type EmbeddingFailure = {
  type: "embedding-failure";
  data: {
    error: string;
    embedding: null;
  };
};

export type EmbeddingObject = EmbeddingSuccess | EmbeddingFailure;

export type PineconeEmbedding = {
  id: string;
  score: number;
  metadata: object;
};

type EmbeddingSearchSuccess = {
  type: "embedding-search-success";
  data: {
    error: null;
    searchResults: PineconeEmbedding[];
  };
};

type EmbeddingSearchFailure = {
  type: "embedding-search-failure";
  data: {
    error: string;
    searchResults: null;
  };
};

export type EmbeddingSearchResult =
  | EmbeddingSearchSuccess
  | EmbeddingSearchFailure;

export type PromptObject = {
  id: string;
  problem: string;
  prompt: string;
};

type GetPromptSuccess = {
  type: "get-prompt-success";
  data: {
    error: null;
    promptObject: PromptObject;
  };
};

type GetPromptFailure = {
  type: "get-prompt-failure";
  data: {
    error: string;
    promptObject: null;
  };
};

export type GetPromptObject = GetPromptSuccess | GetPromptFailure;

export type PromptIndexObject = {
  similarityScore: number;
  keywordScore: number;
  prompt: PromptObject;
};

type CreatePromptSuccess = {
  type: "create-prompt-success";
  data: {
    error: null;
    promptObject: PromptObject;
  };
};

type CreatePromptFailure = {
  type: "create-prompt-failure";
  data: {
    error: string;
    promptObject: null;
  };
};

export type CreatePromptObject = CreatePromptSuccess | CreatePromptFailure;

export type CreatePromptProps = {
  exInput: string;
  exOutput: string;
  isOpen: boolean;
  problem: string;
  setExOutput: (exOutput: string) => void;
  setExInput: (exInput: string) => void;
};

export type GenerationParams = {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  best_of?: number;
  n?: number;
  stream?: boolean;
  stop?: string[];
  echo?: boolean;
  logprobs?: number | string;
  logit_bias?: number;
};

export type LMResponse = {
  model: string;
  prompt: string;
  choices: string[];
};

type LMResponseSuccess = {
  type: "lm-response-success";
  data: {
    error: null;
    lmResponse: LMResponse;
  };
};

type LMResponseFailure = {
  type: "lm-response-failure";
  data: {
    error: string;
    lmResponse: null;
  };
};

export type LMResponseObject = LMResponseSuccess | LMResponseFailure;

export type LMConfig = {
  authKey: string;
  generationEndpoint: string;
  generationEndpointMethod: "POST" | "GET";
  inputMapping: (generationParams: GenerationParams) => object;
  // kwargs for outputMapping
  outputMapping: (
    response: object,
    model: string,
    prompt: string
  ) => LMResponseObject;
};

// TOOD: Add AI21, goose.ai, and others as providers
export type LMProvider = "cohere" | "openai";

type SearchResultSuccess = {
  type: "search-result-success";
  data: {
    error: null;
    searchResults: PromptIndexObject[];
  };
};

type SearchResultFailure = {
  type: "search-result-failure";
  data: {
    error: string;
    searchResults: null;
  };
};

export type SearchResult = SearchResultSuccess | SearchResultFailure;
