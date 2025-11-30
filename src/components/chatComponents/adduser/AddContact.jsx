import { useEffect, useState } from "react";
import styles from "./addContact.module.css";
import DefaultImage from "../../../util/DefaultImage.jsx";
import useDebouncedSearch from "../../../util/useDebouncedSearch.js";
import { createNewChatRoom } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context";

function SearchBar({ setResult, setSearchTerm, searchTerm }) {
  const { user } = useAuthContext();
  const { results  } = useDebouncedSearch(
    searchTerm,
    user.uid,
    500
  );

  useEffect(() => {
    setResult(results);
  }, [results, setResult]);

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
    </div>
  );
}

function AddContact() {
  const { user } = useAuthContext();
  const [result, setResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup,setShowPopup] = useState(false);
  const [contactName,setContactName] = useState("")

  async function handleAdd(otherUser) {
    if (otherUser && user) {
      setSearchTerm("");
      await createNewChatRoom(user, otherUser);
      setContactName(otherUser.displayName);
      setShowPopup(true)
    }
  }
  return (
    <div className={styles.addContactWrapper}>
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
                <DefaultImage text={contact.email} />
              )}
            </div>
            <div className={styles.userEmail}>{contact.email}</div>
            <button
              className={styles.addUser}
              onClick={() => {
                handleAdd(contact)
              }}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
       
      <div className={`${styles.notificationWrapper} ${showPopup && styles.show}`}>
          <button className={styles.closePopup} title="Close popup" onClick={()=>{setShowPopup(false)}}>X</button>
          <p>You have added a new contact.</p>
          <p>{contactName} is now a contact.</p>
      </div>
    </div>
  );
}

export default AddContact;
