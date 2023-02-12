// File: pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getEmbedding } from "../lib/client/embed";
import Header from "../components/header";
import { SearchForm } from "../components/searchForm";
import { SearchResult } from "../lib/types";
import { search } from "../lib/client/search";
import SearchResultList from "../components/searchResultList";

const Home: NextPage = () => {
  const [embedding, setEmbedding] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [problem, setProblem] = useState<string>("");
  const [searchResult, setSearchResult] = useState<SearchResult>();
  const [user, setUser] = useState<string>("");

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

  const fullSearch = async () => {
    setLoading(true);
    setError("");
    const embedding = await getEmbedding(problem, user);
    setEmbedding(embedding);

    const searchResults = await search(embedding, problem, user);
    if (searchResults.type === "search-result-success") {
      setSearchResult(searchResults);

      if (searchResults.data.searchResults.length === 0) {
        setError("No existing prompts found. Let's create one!");
      }
    } else {
      setError(searchResults.data.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Get or create a user ID when the page loads
    if (typeof window !== "undefined") {
      const uid = getUidFromAppStorage();
      setUser(uid);
    }
  }, []);

  // MAKE THIS A COMMUNITY THING WHERE EVERYONE CAN SEE ALL THE PROMPTS AND DISCOVER BASED ON EMBEDDINGS AND LIKE MAYBE EVENT PROMPT BOUNTIES???

  // TODO: Make sure that we handle when to show the form properly

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2 transition-all duration-750 ease-out">
      <Head>
        <title>FindMyPrompt</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="flex w-full flex-col items-center justify-center px-10 md:px-20 text-left md:text-center mt-10">
        <SearchForm
          embedding={embedding}
          error={error}
          loading={loading}
          problem={problem}
          search={fullSearch}
          searchResult={searchResult}
          setError={setError}
          setLoading={setLoading}
          setProblem={setProblem}
          user={user}
        />
        <SearchResultList searchResult={searchResult} />
      </main>
    </div>
  );
};

export default Home;
