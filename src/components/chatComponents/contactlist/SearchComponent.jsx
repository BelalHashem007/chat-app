import { useState } from "react";
import styles from "./searchComponent.module.css";
import DefaultImage from "../../../util/DefaultImage";
import useDebouncedSearch from "../../../util/useDebouncedSearch";
import { createNewChatRoom } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context";


function SearchBar() {
  const {user} = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { results, isLoading, error, showResultsArea } =
    useDebouncedSearch(searchTerm, user.uid,500);

  async function handleAdd(otherUser) {
    if (otherUser && user) {
      setSearchTerm("");
      await createNewChatRoom(user, otherUser);
    }
  }

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
            <li className={styles.searchResult} key={result.uid}>
              <div className={styles.userPic}>
                {result.photoURL ? (
                  <img src={result.photoURL} alt={result.displayName} />
                ) : (
                  <DefaultImage text={result.email} />
                )}
              </div>
              <div className={styles.userEmail}>{result.email}</div>
              <button
                className={styles.addUser}
                onClick={() => {
                  handleAdd(result);
                }}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.loading}>{isLoading && "Searching..."}</div>
        <div className={styles.error}>{error}</div>
        <div>{results.length == 0 && !isLoading && "No results."}</div>
      </div>
    </div>
  );
}
export default SearchBar;
