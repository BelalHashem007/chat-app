import ContactOptions from "./ContactOptions";
import SearchBar from "./SearchComponent";
import styles from "./optionsSearchWrapper.module.css";

function OptionsSearchWrapper() {
  return (
    <div className={styles.optionsSearchWrapper}>
      <ContactOptions />
      <SearchBar />
    </div>
  );
}

export default OptionsSearchWrapper;
