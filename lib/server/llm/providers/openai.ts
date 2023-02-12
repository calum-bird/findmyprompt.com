// File: lib/server/llm/providers/openai.ts
import {
  GenerationParams,
  LMConfig,
  LMResponse,
  LMResponseObject,
} from "../../../types";

const mapInput = (generationParams: GenerationParams) => {
  return generationParams;
};

const mapOutput = (
  res: any,
  model: string,
  prompt: string
): LMResponseObject => {
  let responseObj: LMResponseObject;
  if (res.choices && res.choices.length > 0) {
    let lmResponse: LMResponse = {
      model: model,
      prompt: prompt,
      choices: res.choices.map((choice: any) => choice.text),
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

export const openai = (): LMConfig => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY env var not set.");
  }

  return {
    authKey: process.env.OPENAI_API_KEY,
    generationEndpoint: "https://oai.hconeai.com/v1/completions",
    generationEndpointMethod: "POST",
    inputMapping: mapInput,
    outputMapping: mapOutput,
  };
};
