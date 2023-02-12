// File: lib/server/llm/generate.ts
import {
  GenerationParams,
  LMConfig,
  LMProvider,
  LMResponseObject,
} from "../../types";
import { cohere } from "./providers/cohere";
import { openai } from "./providers/openai";

export default function generate(
  generationParams: GenerationParams,
  provider: string
): Promise<LMResponseObject> {
  let providerConfig = provider === "cohere" ? cohere() : openai();
  return _generate(providerConfig, generationParams);
}

const _generate = (
  providerConfig: LMConfig,
  generationParams: GenerationParams
): Promise<LMResponseObject> => {
  const {
    authKey,
    generationEndpoint,
    generationEndpointMethod,
    inputMapping,
    outputMapping,
  } = providerConfig;

  const input = inputMapping(generationParams);

  return fetch(generationEndpoint, {
    method: generationEndpointMethod,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authKey,
    },
    body: JSON.stringify(input),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return outputMapping(
        res,
        generationParams.model,
        generationParams.prompt
      );
    })
    .catch((err) => {
      return {
        type: "lm-response-failure",
        data: {
          error: typeof err === "string" ? err : err.toString(),
          lmResponse: null,
        },
      };
    });
};
