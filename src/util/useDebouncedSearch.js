import { useState, useEffect } from "react";
import { searchUsers } from "../firebase/firebase_db/database";
import { useAuthContext } from "./context";

const useDebouncedSearch = (searchTerm, delay = 500) => {
  const { user } = useAuthContext();
  const [searchState, setSearchState] = useState({
    results: [],
    isLoading: false,
    error: null,
    showResultsArea: false,
    noResult: false,
  });

  useEffect(() => {
    const updateSearchState = (updates) => {
      setSearchState((prev) => ({ ...prev, ...updates }));
    };

    // 1. Handle empty search term: Reset all states
    if (!searchTerm.trim()) {
      updateSearchState({
        results: [],
        isLoading: false,
        error: null,
        showResultsArea: false,
        noResult: false,
      });
      return;
    }

    // 2. Set the debounced timeout
    const handler = setTimeout(async () => {
      try {
        updateSearchState({
          results: [],
          isLoading: true,
          showResultsArea: true,
          error: null,
        });
        const searchResult = await searchUsers(searchTerm, user.uid);

        if (searchResult.error) {
          updateSearchState({
            error: searchResult.error,
            results: [],
            isLoading: false,
            noResult: false,
          });
        } else {
          updateSearchState({
            results: searchResult.data,
            error: null,
            isLoading: false,
            noResult: searchResult.data.length == 0,
          });
        }
      } catch (err) {
        updateSearchState({
          error: new Error("An unexpected error occurred during search."),
          results: [],
          isLoading: false,
          noResult: false,
        });
        console.error("Unexpected error in useDebouncedSearch:", err);
      }
    }, delay);

    // 3. Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, user.uid]);

  return {
    results: searchState.results,
    isLoading: searchState.isLoading,
    error: searchState.error,
    showResultsArea: searchState.showResultsArea,
    noResult: searchState.noResult,
  };
};

export default useDebouncedSearch;
