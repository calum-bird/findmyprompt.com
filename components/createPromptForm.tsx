import { useEffect, useState } from "react";
import { CreatePromptProps } from "../lib/types";

export default function CreatePromptForm(props: CreatePromptProps) {
  const { isOpen, setIsOpen, generatePrompt } = props;

  const [problem, setProblem] = useState<string>("");
  const [exInput, setExInput] = useState<string>("");
  const [exOutput, setExOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [hasFilledAllFields, setHasFilledAllFields] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const createPrompt = async () => {
    setLoading(true);
    const generatedPrompt = await generatePrompt(problem, exInput, exOutput);

    if (generatedPrompt.type === "create-prompt-success") {
      const { promptObject } = generatedPrompt.data;
      setResult(promptObject.prompt);
    } else {
      setError(generatedPrompt.data.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (problem.length > 0 && exInput.length > 0 && exOutput.length > 0) {
      setHasFilledAllFields(true);
    } else {
      setHasFilledAllFields(false);
    }
  }, [problem, exInput, exOutput]);

  return (
    <main
      className={
        "flex w-full flex-col items-center justify-center px-10 md:px-20 text-left md:text-center mt-10"
      }
    >
      <textarea
        className={
          (isOpen ? "h-32" : "h-full") +
          " w-full md:w-1/2 p-3 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        }
        aria-multiline={isOpen}
        rows={1}
        placeholder="I am trying to..."
        onFocus={() => setIsOpen(true)}
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      />
      <textarea
        className={
          (isOpen ? "h-32 opacity-100" : "h-0 opacity-0") +
          " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        }
        aria-multiline={isOpen}
        rows={1}
        placeholder="Here's what I put in:"
        value={exInput}
        onChange={(e) => setExInput(e.target.value)}
      />
      <textarea
        className={
          (isOpen ? "h-32 opacity-100" : "h-0 opacity-0") +
          " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        }
        aria-multiline={isOpen}
        rows={1}
        placeholder="And here is what I want out:"
        value={exOutput}
        onChange={(e) => setExOutput(e.target.value)}
      />
      <button
        className={
          (hasFilledAllFields
            ? "opacity-100"
            : isOpen
            ? "opacity-40"
            : "opacity-0") +
          " w-full md:w-1/2 mt-2 p-3 text-xl text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-1000 ease-out"
        }
        disabled={!hasFilledAllFields}
        onClick={createPrompt}
      >
        {loading ? "..." : "Find my prompt!"}
      </button>
      {error !== "" && (
        <div className="w-full md:w-1/2 mt-2 p-3 text-xl text-red-500">
          {error}. Please try again.
        </div>
      )}
    </main>
  );
}
