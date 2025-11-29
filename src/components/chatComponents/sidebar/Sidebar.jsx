import Icon from "@mdi/react";
import { mdiMessageText, mdiAccount, mdiLogout } from "@mdi/js";
import styles from "./sidebar.module.css";
import { LogOut } from "../../../firebase/firebase_auth/authentication";
import { useNavigate } from "react-router";

function Sidebar({ setShowProfile }) {
  const navigate = useNavigate();
  async function handleLogout() {
    const result = await LogOut();
    if (result === true){
      navigate("/login");
    }
    else {
      console.log("Sign out failed!")
    }
  }

  return (
    <nav aria-label="Sidebar" className={styles.sidebar}>
      <ul className={styles.list}>
        <div className={styles.top}>
          <li  aria-label="Chats" className={styles.listItem}>
            <button
              onClick={() => {
                setShowProfile(false);
              }}
              title="Chats"
            >
              <Icon path={mdiMessageText} size={1} />
            </button>
          </li>
          <li title="Profile" aria-label="Profile" className={styles.listItem}>
            <button
              onClick={() => {
                setShowProfile(true);
              }}
            >
              <Icon path={mdiAccount} size={1} />
            </button>
          </li>
        </div>
        <div className={styles.bottom}>
          <li className={styles.listItem} title="Log out" aria-label="Log out">
            <button className={styles.logoutBtn} onClick={handleLogout}>
              {" "}
              <Icon path={mdiLogout} size={1} />
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Sidebar;
