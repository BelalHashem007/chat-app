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
      if (chat.isGroupChat){
        return chat.groupName.toLowerCase().includes(searchTerm.toLowerCase())
      }
      else {return chat.enrichedParticipants.some((participate) => {
        // check if displayname starts with the search term
        if (participate.uid == user.uid) return false;
        return participate.displayName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }});
    setActiveChats(newChats);
  }, [searchTerm, chats, user, setActiveChats]);

  return (
    <div className={styles.searchWrapper}>
      <label htmlFor="contact-filter" className={styles.srOnly}>
        Search contacts
      </label>
      <input
        className={styles.searchInp}
        type="test"
        name="contact-filter"
        id="contact-filter"
        placeholder="Search"
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
