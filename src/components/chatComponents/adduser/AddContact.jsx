import { useEffect, useState } from "react";
import styles from "./addContact.module.css";
import DefaultImage from "../../../util/DefaultImage.jsx";
import useDebouncedSearch from "../../../util/hooks/useDebouncedSearch.js";
import { createNewChatRoom } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context/authContext.js";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useToastContext } from "../../../util/context/toastContext.js";

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
        showToast(<p>Something went wrong. Please try again.</p>);
      if (result.isChatCreated)
        showToast(<p>{otherUser.displayName} is now a contact.</p>);
        
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
    >
      <button title="back" className={styles.backBtn} onClick={handleBack}>
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

      <ul className={styles.resultWrapper}>
        {result.map((contact) => (
          <li className={styles.searchResult} key={contact.uid}>
            <div className={styles.userPic}>
              {contact.photoURL ? (
                <img src={contact.photoURL} alt={contact.displayName} />
              ) : (
                <DefaultImage text={contact.email || contact.displayName} />
              )}
            </div>
            <div>
              <div className={styles.userEmail}>
                {contact.email || contact.displayName}
              </div>
              {contact.isAnonymous && (
                <span className={styles.guestId}> #{contact.guestId}</span>
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
function SearchBar({ setResult, setSearchTerm, searchTerm }) {
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
      <p>{noResult && "No results."}</p>
    </>
  );
}

export default AddContact;
