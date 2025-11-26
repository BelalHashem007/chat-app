import { useState, useEffect } from "react";
import { searchUsers } from "../firebase/firebase_db/database";

const useDebouncedSearch = (searchTerm, delay = 500) => {
  const [searchState, setSearchState] = useState({
    results: [],
    isLoading: false,
    error: null,
    showResultsArea: false,
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
      });
      return;
    }

    // 2. As soon as typing starts, set loading and show the results area
    updateSearchState({
      results: [],
      isLoading: true,
      showResultsArea: true,
      error: null,
    });

    // 3. Set the debounced timeout
    const handler = setTimeout(async () => {
      try {
        const searchResult = await searchUsers(searchTerm);

        if (searchResult.error) {
          updateSearchState({
            error: searchResult.error,
            results: [],
            isLoading: false,
          });
        } else {
          updateSearchState({
            results: searchResult.data,
            error: null,
            isLoading: false,
          });
        }
      } catch (err) {
        updateSearchState({
          error: new Error("An unexpected error occurred during search."),
          results: [],
          isLoading: false,
        });
        console.error("Unexpected error in useDebouncedSearch:", err);
      }
    }, delay);

    // 4. Cleanup function: This is CRUCIAL for debouncing!
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return {
    results: searchState.results,
    isLoading: searchState.isLoading,
    error: searchState.error,
    showResultsArea: searchState.showResultsArea,
  };
};

export default useDebouncedSearch;
