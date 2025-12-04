import { useAuthContext } from "../../util/context/authContext";
import styles from "./chat.module.css";
import Contact from "../../components/chatComponents/contactlist/Contact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import AddContact from "../../components/chatComponents/adduser/AddContact";
import AddGroup from "../../components/chatComponents/addGroup/AddGroup";
import { useState } from "react";

function ContactList({
  selectedChat,
  setSelectedChat,
  chats,
  activeChats,
  setActiveChats,
}) {
  const { user } = useAuthContext();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  console.log(chats);
  return (
    <div className={styles.contactList}>
      <AddContact
        showAddContact={showAddContact}
        setShowAddContact={setShowAddContact}
      />
      <AddGroup showAddGroup={showAddGroup} setShowAddGroup={setShowAddGroup} chats={chats}/>
      <header className={styles.logo}>
        <Logo />
      </header>
      <nav className={styles.navContactList} aria-label="Contacts">
        <h2 className={styles.srOnly}>Contact List</h2>
        <div className={styles.options}>
          <OptionsSearchWrapper
            chats={chats}
            setActiveChats={setActiveChats}
            setShowAddContact={setShowAddContact}
            setShowAddGroup={setShowAddGroup}
          />
        </div>
        <ul className={styles.users}>
          {activeChats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
              }}
              className={`${
                selectedChat &&
                (selectedChat.id == chat.id ? styles.activeContact : "")
              }`}
            >
              {<Contact chat={chat} curUserUid={user.uid} />}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ContactList;
