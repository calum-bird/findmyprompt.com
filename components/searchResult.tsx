// File: components/searchResult.tsx
import { PromptObject } from "../lib/types";

export default function SearchResult(props: { prompt: PromptObject }) {
  const { prompt } = props;
  return (
    <div className="flex flex-col items-start justify-center w-full flex-1 text-left my-2 p-2 rounded-lg">
      <h1 className="border-b border-gray-400 px-2 text-lg w-full">
        {prompt.problem}
      </h1>
      <code className="bg-gray-200 p-2 text-md">{prompt.prompt}</code>
    </div>
  );
}
