import { useAuthContext } from "../../util/context";
import styles from "./chat.module.css"
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import Logo from "../../components/chatComponents/logo/LogoComponent";

function ContactList({ selectedChat, setSelectedChat,chats,activeChats,setActiveChats,setActiveComponent }) {
  const { user } = useAuthContext();
  console.log(chats)
  return (
    <div className={styles.contactList}>
      <header className={styles.logo}>
        <Logo />
      </header>
      <nav className={styles.navContactList} aria-label="Contacts">
        <h2 className={styles.srOnly}>Contact List</h2>
        <div className={styles.options}>
          <OptionsSearchWrapper chats={chats} setActiveChats={setActiveChats} setActiveComponent={setActiveComponent}/>
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
              {<UserContact chat={chat} curUserUid={user.uid} />}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ContactList;