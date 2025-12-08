import Icon from "@mdi/react";
import { mdiMessageText, mdiAccount, mdiLogout } from "@mdi/js";
import styles from "./sidebar.module.css";
import { LogOut } from "../../../firebase/firebase_auth/authentication";
import { useNavigate } from "react-router";
import { useState } from "react";
import {useToastContext} from "../../../util/context/toastContext"

function Sidebar({ setActiveComponent }) {
  const navigate = useNavigate();
  const [clickedElement, setClickedElement] = useState("");
  const {showToast} = useToastContext();

  async function handleLogout() {
    const result = await LogOut();
    if (result === true) {
      navigate("/login");
    } else {
      showToast(<p>Sign out failed!</p>)
    }
  }

  return (
    <nav aria-label="Sidebar" className={styles.sidebar}>
      <ul className={styles.list}>
        <div className={styles.top}>
          <li aria-label="Chats" className={`${styles.listItem}`} title="Chats">
            <button
              data-testid="chatsBtn"
              className={`${clickedElement == "chats" && styles.clicked}`}
              onClick={() => {
                setActiveComponent("contactList");
                setClickedElement("chats");
              }}
            >
              <Icon
                path={mdiMessageText}
                size={1}
                className={styles.chatsIcon}
              />
            </button>
          </li>
          <li
            title="Profile"
            aria-label="Profile"
            className={`${styles.listItem}`}
          >
            <button
              data-testid="profileBtn"
              className={`${clickedElement == "profile" && styles.clicked}`}
              onClick={() => {
                setActiveComponent("profile");
                setClickedElement("profile");
              }}
            >
              <Icon path={mdiAccount} size={1} className={styles.profileIcon} />
            </button>
          </li>
        </div>
        <div className={styles.bottom}>
          <li className={styles.listItem} title="Log out" aria-label="Log out">
            <button
              data-testid="logoutBtn"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              {" "}
              <Icon path={mdiLogout} size={1} className={styles.logoutIcon} />
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Sidebar;
