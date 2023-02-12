// File: components/searchResultList.tsx

import {
  PromptIndexObject,
  SearchResult as SearchResultType,
} from "../lib/types";
import SearchResult from "./searchResult";

export default function SearchResultList({
  searchResult,
}: {
  searchResult: SearchResultType | undefined;
}) {
  if (!searchResult || searchResult.type === "search-result-failure") {
    return <></>;
  }

  const searchResults = searchResult.data.searchResults;
  if (searchResults.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center mt-5">
      {searchResults.map((searchResult) => (
        <div>
          <SearchResult prompt={searchResult.prompt} />
        </div>
      ))}
    </div>
  );
}
