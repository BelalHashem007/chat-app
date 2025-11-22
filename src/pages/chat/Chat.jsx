import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import userAvatar from "../../assets/Avatar.png";
import Logo from "../../components/chatComponents/logo/LogoComponent";

const users = [
  { id: 1, url: userAvatar, name: "Belal" },
  { id: 2, url: userAvatar, name: "Ahmed" },
  { id: 3, url: userAvatar, name: "Belal" },
];

function Chat() {
  return (
    <div className={styles.chatWrapper}>
      <ContactList />
      <div className={styles.chatWindow}>
        <div className={styles.optionsUserWrapper}>
          <div className={styles.userInfo}></div>
           <div className={styles.options}>unfinished</div>
        </div>
        <div className={styles.window}>messages...</div>
        <div>Place to send messages</div>
      </div>
    </div>
  );
} 

function ContactList() {
  return (
    <div className={styles.contactList}>
      <header className={styles.logo}>
        <Logo />
      </header>
      <div className={styles.options}>
        <OptionsSearchWrapper />
      </div>
      <div className={styles.users}>
        {users.map((user) => (
          <UserContact key={user.id} user={user}/>
        ))}
      </div>
    </div>
  );
}

export default Chat;
