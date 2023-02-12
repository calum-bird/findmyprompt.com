// File: components/searchResult.tsx
import { PromptObject } from "../lib/types";

export default function SearchResult(props: { prompt: PromptObject }) {
  const { prompt } = props;
  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center my-2">
      <h1 className="text-xl font-italic">{prompt.problem}</h1>
      <p className="mt-1 text-lg">{prompt.prompt}</p>
    </div>
  );
}
