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

  console.log(searchResults);

  return (
    <div className="w-full md:w-1/2 text-left mt-5">
      {searchResults.map((searchResult) => (
        <div key={searchResult.prompt.id}>
          <SearchResult prompt={searchResult.prompt} />
        </div>
      ))}
    </div>
  );
}
