import { useState } from "react";
import styles from "./addContact.module.css";
import DefaultImage from "../../../util/DefaultImage.jsx";
import { createNewChatRoom } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context/authContext.js";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useToastContext } from "../../../util/context/toastContext.js";
import { SearchBar } from "./SearchBar.jsx";

function AddContact({ showAddContact, setShowAddContact }) {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const [result, setResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleAdd(otherUser) {
    if (otherUser && user) {
      setSearchTerm("");

      const result = await createNewChatRoom(user, [otherUser, user], false);

      if (result.error)
        showToast(<p data-testid="failedMessage">Something went wrong. Please try again.</p>);
      if (result.isChatCreated)
        showToast(<p data-testid="successMessage">{otherUser.displayName} is now a contact.</p>);
    }
  }

  function handleBack() {
    setShowAddContact(false);
    setSearchTerm("");
  }

  return (
    <div
      inert={!showAddContact}
      className={`${styles.addContactWrapper} ${showAddContact && styles.show}`}
      data-testid="AddContactWrapper"
    >
      <button title="back" aria-label="back" className={styles.backBtn} onClick={handleBack}>
        <Icon path={mdiArrowLeft} size={1} />
      </button>
      <header>
        <h2>Search for new Contacts</h2>
      </header>
      <SearchBar
        setResult={setResult}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ul className={styles.resultWrapper} data-testid="resultWrapper">
        {result.map((contact) => (
          <li className={styles.searchResult} key={contact.uid}>
            <div className={styles.userPic} data-testid="userPic">
              {contact.photoURL ? (
                <img src={contact.photoURL} alt={contact.displayName} />
              ) : (
                <DefaultImage text={contact.email || contact.displayName} />
              )}
            </div>
            <div>
              <div className={styles.userEmail} data-testid="userEmail">
                {contact.email || contact.displayName}
              </div>
              {contact.isAnonymous && (
                <span className={styles.guestId} data-testid="guestId"> #{contact.guestId}</span>
              )}
            </div>
            <button
              className={styles.addUser}
              onClick={() => {
                handleAdd(contact);
              }}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddContact;
