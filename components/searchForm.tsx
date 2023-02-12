import { useEffect, useState } from "react";
import { createPrompt } from "../lib/client/prompt";
import { SearchResult } from "../lib/types";
import CreatePromptForm from "./createPromptForm";

type SearchFormProps = {
  embedding: number[];
  error: string;
  loading: boolean;
  problem: string;
  search: () => void;
  searchResult: SearchResult | undefined;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setProblem: (problem: string) => void;
  user: string;
};

export const SearchForm = (props: SearchFormProps): JSX.Element => {
  const [exInput, setExInput] = useState<string>("");
  const [exOutput, setExOutput] = useState<string>("");
  const [areResultsEmpty, setAreResultsEmpty] = useState<boolean>(false);
  const [hasFilledAllFields, setHasFilledAllFields] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  const {
    embedding,
    error,
    loading,
    problem,
    search,
    searchResult,
    setError,
    setLoading,
    setProblem,
    user,
  } = props;

  const generatePrompt = async () => {
    setLoading(true);
    const generatedPrompt = await createPrompt(
      embedding,
      exInput,
      exOutput,
      problem,
      user
    );

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

  useEffect(() => {
    if (searchResult && searchResult.type === "search-result-success") {
      if (searchResult.data.searchResults.length > 0) {
        setAreResultsEmpty(false);
      } else {
        setAreResultsEmpty(true);
      }
    }
  }, [searchResult]);

  return (
    <>
      <textarea
        className="w-full md:w-1/2 p-3 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
        aria-multiline={true}
        rows={2}
        placeholder="I am trying to..."
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      />
      {areResultsEmpty && (
        <CreatePromptForm
          exInput={exInput}
          exOutput={exOutput}
          isOpen={areResultsEmpty}
          problem={problem}
          setExInput={setExInput}
          setExOutput={setExOutput}
        />
      )}
      <button
        className={
          "w-full md:w-1/2 mt-2 p-3 text-xl text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-250 ease-out opacity-100 disabled:opacity-40 disabled:pointer-events-none"
        }
        disabled={problem === "" || loading}
        onClick={areResultsEmpty ? generatePrompt : search}
      >
        {loading
          ? "..."
          : areResultsEmpty
          ? "Create my prompt!"
          : "Find my prompt!"}
      </button>
      {error !== "" && (
        <div className="w-full md:w-1/2 mt-2 p-3 text-xl text-red-800">
          {error}
        </div>
      )}
    </>
  );
};
