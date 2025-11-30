import { useEffect, useState } from "react";
import styles from "./searchComponent.module.css";
import { useAuthContext } from "../../../util/context";


function SearchContacts({chats,setActiveChats}) {
  const {user} = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");

    useEffect(()=>{
      if (!searchTerm || !searchTerm.trim()){
        setActiveChats(chats)
        return;
      }
      const newChats = chats.filter((chat)=>{
        return chat.enrichedParticipants.some((participate)=>{
          // check if displayname starts with the search term
          if (participate.uid == user.uid) return false;
          return participate.displayName.toLowerCase().includes(searchTerm.toLowerCase()); 
        })
      })
      setActiveChats(newChats)
    },[searchTerm,chats,user,setActiveChats])

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
        autoComplete="off"
      />
    </div>
  );
}
export default SearchContacts;
