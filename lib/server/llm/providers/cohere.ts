// File: lib/server/llm/providers/cohere.ts
import {
  GenerationParams,
  LMConfig,
  LMResponse,
  LMResponseObject,
} from "../../../types";

export const mapInput = (generationParams: GenerationParams) => {
  return {
    prompt: generationParams.prompt,
    model: generationParams.model,
    num_generations: generationParams.n,
    max_tokens: generationParams.max_tokens,
    temperature: generationParams.temperature,
    p: generationParams.top_p,
    frequency_penalty: generationParams.frequency_penalty,
    presence_penalty: generationParams.presence_penalty,
    end_sequences: generationParams.stop,
    return_likelihoods: generationParams.logprobs,
    logit_bias: generationParams.logit_bias,
  };
};

export const mapOutput = (
  res: any,
  model: string,
  prompt: string
): LMResponseObject => {
  let responseObj: LMResponseObject;
  if (res.generations && res.generations.length > 0) {
    let lmResponse: LMResponse = {
      model: model,
      prompt: prompt,
      choices: res.generations.map(
        (generation: { id: string; text: string }) => generation.text
      ),
    };

    responseObj = {
      type: "lm-response-success",
      data: {
        error: null,
        lmResponse: lmResponse,
      },
    };
  } else {
    responseObj = {
      type: "lm-response-failure",
      data: {
        error: res.error.message,
        lmResponse: null,
      },
    };
  }

  return responseObj;
};

export const cohere = (): LMConfig => {
  if (!process.env.COHERE_API_KEY) {
    throw new Error("COHERE_API_KEY env var not set.");
  }

  return {
    authKey: process.env.COHERE_API_KEY,
    generationEndpoint: "https://api.cohere.ai/generate",
    generationEndpointMethod: "POST",
    inputMapping: mapInput,
    outputMapping: mapOutput,
  };
};
