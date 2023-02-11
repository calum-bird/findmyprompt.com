import { GenerationParams, LMConfig, LMResponseObject } from "../types";

export default function generate(
  providerConfig: LMConfig,
  generationParams: GenerationParams
): Promise<LMResponseObject> {
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
}
