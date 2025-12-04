import { useEffect, useState } from "react";
import styles from "./searchContacts.module.css";
import { useAuthContext } from "../../../util/context/authContext";

function SearchContacts({ chats, setActiveChats }) {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm || !searchTerm.trim()) {
      setActiveChats(chats);
      return;
    }
    const newChats = chats.filter((chat) => {
      return chat.enrichedParticipants.some((participate) => {
        // check if displayname starts with the search term
        if (participate.uid == user.uid) return false;
        return participate.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
    setActiveChats(newChats);
  }, [searchTerm, chats, user, setActiveChats]);

  return (
    <div className={styles.searchWrapper}>
      <label htmlFor="contact-search" className={styles.srOnly}>
        Search contacts
      </label>
      <input
        className={styles.searchInp}
        type="search"
        name="contact-search"
        id="contact-search"
        placeholder="Search"
        aria-label="Search contacts"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        autoComplete="off"
      />
    </div>
  );
}
export default SearchContacts;
