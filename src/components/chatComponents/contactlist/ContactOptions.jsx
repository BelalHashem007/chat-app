import { useEffect, useRef, useState } from "react";
import styles from "./contactOptions.module.css";
import Icon from "@mdi/react";
import { mdiAccountMultiplePlusOutline, mdiAccountPlusOutline } from "@mdi/js";

function ContactOptions({ setShowAddContact, setShowAddGroup }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  function handleMenuChange() {
    setMenuOpen(!menuOpen);
  }

  function handleContactButton() {
    setShowAddContact(true);
    handleMenuChange();
  }
  function handleGroupButton() {
    setShowAddGroup(true);
    handleMenuChange();
  }

  //close menu on click outside
  function handleClickOutside(e){
    if (menuRef.current && !menuRef.current.contains(e.target))
      setMenuOpen(false)
  }

  useEffect(()=>{
    document.addEventListener("mousedown",handleClickOutside)
  })

  return (
    <div className={styles.menuWrapper}  ref={menuRef}>
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
        <button className={styles.menuOpion} onClick={handleContactButton}>
          <Icon path={mdiAccountPlusOutline} size={1} /> New contact
        </button>
        <button className={styles.menuOpion} onClick={handleGroupButton}>
          <Icon path={mdiAccountMultiplePlusOutline} size={1} /> New group
        </button>
      </div>
    </div>
  );
}
export default ContactOptions;
