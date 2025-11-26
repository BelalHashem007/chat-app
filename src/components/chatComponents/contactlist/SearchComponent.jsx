import { useEffect, useState } from "react";
import styles from "./searchComponent.module.css";
import DefaultImage from "../../../util/DefaultImage";
import useDebouncedSearch from "../../../util/useDebouncedSearch";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { results, isLoading, error, showResultsArea } = useDebouncedSearch(
    searchTerm,
    500
  );
  useEffect(() => {
    if (!searchTerm.trim()) {
      return;
    }
  }, [searchTerm]);
  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.searchInp}
        type="search"
        name="contactList"
        id=""
        placeholder="Search"
        aria-label="Search contacts"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <div
        className={`${styles.searchResultsWrapper} ${
          showResultsArea && styles.active
        }`}
      >
        <ul>
          {results.map((result) => (
            <li className={styles.searchResult}>
              <div className={styles.userPic}>
                {result.photoURL ? (
                  <img src={result.photoURL} alt={result.displayName} />
                ) : (
                  <DefaultImage user={result} />
                )}
              </div>
              <div className={styles.userEmail}>{result.email}</div>
              <button className={styles.addUser}>Add</button>
            </li>
          ))}
        </ul>
        <div className={styles.loading}>{isLoading && "Searching..."}</div>
        <div className={styles.error}>{error}</div>
        <div>{results.length ==0 && !isLoading && "No results."}</div>
      </div>
    </div>
  );
}
export default SearchBar;
