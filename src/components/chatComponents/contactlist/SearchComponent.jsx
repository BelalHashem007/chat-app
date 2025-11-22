import styles from "./searchComponent.module.css";

function SearchBar() {
  return (
    <div className={styles.searchWrapper}>
      <input
        className={styles.searchInp}
        type="search"
        name=""
        id=""
        placeholder="Search"
      />
    </div>
  );
}
export default SearchBar;
