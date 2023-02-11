import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";
import { getCache, setCache } from "../lib/cache";
import { getEmbedding } from "../lib/embed";
import Header from "../components/header";

const Home: NextPage = () => {
  const [problem, setProblem] = useState<string>("");
  const [exInput, setExInput] = useState<string>("");
  const [exOutput, setExOutput] = useState<string>("");
  const [embedding, setEmbedding] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const [isFocusedOnce, setIsFocusedOnce] = useState<boolean>(false);
  const [hasFilledAllFields, setHasFilledAllFields] = useState<boolean>(false);

  const getUidFromAppStorage = () => {
    if (typeof window !== "undefined") {
      const uid = localStorage.getItem("uid");
      if (uid) {
        return uid;
      }

      const newUid = uuidv4();
      localStorage.setItem("uid", newUid);
      return uuidv4();
    }

    return "";
  };

  const findPrompt = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      // normalize the problem string by removing whitespace and making it lowercase
      const cachedResult = await getCache(problem, user);
      if (cachedResult.type === "cache-hit") {
        setEmbedding(cachedResult.data.result);
      } else if (cachedResult.type === "cache-miss") {
        let embedding = await getEmbedding(problem, user);
        if (embedding.type === "embedding-success") {
          setEmbedding(embedding.data.embedding);
          setCache(embedding.data.embedding, problem, user);
        } else {
          setError(embedding.data.error);
        }
      } else {
        setError(cachedResult.data.error);
      }
    } catch (err: any) {
      setError(err as string);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (problem.length > 0 && exInput.length > 0 && exOutput.length > 0) {
      setHasFilledAllFields(true);
    } else {
      setHasFilledAllFields(true);
    }
  }, [problem, exInput, exOutput]);

  useEffect(() => {
    // Get or create a user ID
    if (typeof window !== "undefined") {
      const uid = getUidFromAppStorage();
      setUser(uid);
    }
  }, []);

  useEffect(() => {
    if (embedding.length > 0) {
      console.log(embedding);
    }
  }, [embedding]);

  // MAKE THIS A COMMUNITY THING WHERE EVERYONE CAN SEE ALL THE PROMPTS AND DISCOVER BASED ON EMBEDDINGS AND LIKE MAYBE EVENT PROMPT BOUNTIES???

  return (
    <div
      className={
        (isFocusedOnce ? "min-h-0" : "min-h-screen") +
        " flex flex-col items-center justify-center py-2 transition-all duration-750 ease-out"
      }
    >
      <Head>
        <title>FindMyPrompt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isFocusedOnce={isFocusedOnce} />

      <main
        className={
          "flex w-full flex-col items-center justify-center px-10 md:px-20 text-left md:text-center mt-10"
        }
      >
        <textarea
          className={
            (isFocusedOnce ? "h-32" : "h-full") +
            " w-full md:w-1/2 p-3 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
          }
          aria-multiline={isFocusedOnce}
          rows={1}
          placeholder="I am trying to..."
          onFocus={() => setIsFocusedOnce(true)}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <textarea
          className={
            (isFocusedOnce ? "h-32 opacity-100" : "h-0 opacity-0") +
            " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
          }
          aria-multiline={isFocusedOnce}
          rows={1}
          placeholder="Here's what I put in:"
          value={exInput}
          onChange={(e) => setExInput(e.target.value)}
        />
        <textarea
          className={
            (isFocusedOnce ? "h-32 opacity-100" : "h-0 opacity-0") +
            " w-full md:w-1/2 p-3 mt-2 text-xl text-gray-700 bg-gray-200 rounded-lg focus:outline-blue-700 focus:bg-gray-100 transition-all duration-750 ease-out"
          }
          aria-multiline={isFocusedOnce}
          rows={1}
          placeholder="And here is what I want out:"
          value={exOutput}
          onChange={(e) => setExOutput(e.target.value)}
        />
        <button
          className={
            (hasFilledAllFields
              ? "opacity-100"
              : isFocusedOnce
              ? "opacity-40"
              : "opacity-0") +
            " w-full md:w-1/2 mt-2 p-3 text-xl text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-1000 ease-out"
          }
          disabled={!hasFilledAllFields || loading}
          onClick={findPrompt}
        >
          {loading ? "..." : "Find my prompt!"}
        </button>
        {error !== "" && (
          <div className="w-full md:w-1/2 mt-2 p-3 text-xl text-red-500">
            {error}. Please try again.
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
