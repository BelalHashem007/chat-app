import { useState } from "react";
import styles from "./contactOptions.module.css";

function ContactOptions() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleMenuChange() {
    setMenuOpen(!menuOpen);
  }

  return (
    <div className={styles.menuWrapper}>
      <button
        className={styles.menuIcon}
        aria-label="Menu"
        onClick={handleMenuChange}
        title="Menu"
      >
        <div
          className={`${styles.bar1} ${menuOpen ? styles.bar1Open : ""}`}
        ></div>
        <div
          className={`${styles.bar2} ${menuOpen ? styles.bar2Open : ""}`}
        ></div>
        <div
          className={`${styles.bar3} ${menuOpen ? styles.bar3Open : ""}`}
        ></div>
      </button>
      <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}>
        <button className={styles.menuOpion}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-plus-outline</title>
            <path d="M15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4M15,5.9C16.16,5.9 17.1,6.84 17.1,8C17.1,9.16 16.16,10.1 15,10.1A2.1,2.1 0 0,1 12.9,8A2.1,2.1 0 0,1 15,5.9M4,7V10H1V12H4V15H6V12H9V10H6V7H4M15,13C12.33,13 7,14.33 7,17V20H23V17C23,14.33 17.67,13 15,13M15,14.9C17.97,14.9 21.1,16.36 21.1,17V18.1H8.9V17C8.9,16.36 12,14.9 15,14.9Z" />
          </svg>{" "}
          New contact
        </button>
        <button className={styles.menuOpion}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>account-multiple-plus-outline</title>
            <path d="M13 11A3 3 0 1 0 10 8A3 3 0 0 0 13 11M13 7A1 1 0 1 1 12 8A1 1 0 0 1 13 7M17.11 10.86A5 5 0 0 0 17.11 5.14A2.91 2.91 0 0 1 18 5A3 3 0 0 1 18 11A2.91 2.91 0 0 1 17.11 10.86M13 13C7 13 7 17 7 17V19H19V17S19 13 13 13M9 17C9 16.71 9.32 15 13 15C16.5 15 16.94 16.56 17 17M24 17V19H21V17A5.6 5.6 0 0 0 19.2 13.06C24 13.55 24 17 24 17M8 12H5V15H3V12H0V10H3V7H5V10H8Z" />
          </svg>{" "}
          New group
        </button>
      </div>
    </div>
  );
}
export default ContactOptions;
