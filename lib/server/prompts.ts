// File: lib/server/prompts.ts

export const buildMetaPrompt = (
  problem: string,
  exInput: string,
  exOutput: string
) => {
  return `Can you write a prompt for the following problem?

Problem:
===
\`\`\`
${problem}
\`\`\`

Here is an example input that we would provide to the new prompt:
\`\`\`
${exInput}
\`\`\`

Here is an example of our desired output:
\`\`\`
${exOutput}
\`\`\`
===
When writing your prompt, include clever tricks like:
1. Starting the solution with a plausible word to induce the right answer
2. Showing GPT-3 the desired output format with an example
3. Including test data in the prompt

Prompt:
===
Can you help`;
};
