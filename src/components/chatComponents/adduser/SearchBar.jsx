import styles from "./searchbar.module.css";
import { useEffect } from "react";
import useDebouncedSearch from "../../../util/hooks/useDebouncedSearch";

export function SearchBar({ setResult, setSearchTerm, searchTerm }) {
  const { results, noResult } = useDebouncedSearch(searchTerm, 500);

  useEffect(() => {
    setResult(results);
  }, [results, setResult]);

  return (
    <>
      <div className={styles.searchWrapper}>
        <label htmlFor="contact-search" className={styles.srOnly}>
          Search for new contacts using e-mail or guestId
        </label>
        <input
          className={styles.searchInp}
          type="search"
          name="contact-search"
          id="contact-search"
          placeholder="Search using e-mail or guestId"
          aria-label="Search contacts"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      {noResult &&<p data-testid="noResult"> "No results."</p>}
    </>
  );
}
