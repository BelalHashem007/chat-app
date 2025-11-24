import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import userAvatar from "../../assets/Avatar.png";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import UserInfoComponent from "../../components/chatComponents/chatwindow/UserInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";

const users = [
  { id: 1, url: userAvatar, name: "Belal" },
  { id: 2, url: userAvatar, name: "Ahmed" },
  { id: 3, url: userAvatar, name: "Belal" },
];

function Chat() {
  return (
    <div className={styles.chatWrapper}>
      <ContactList />
      <main aria-label={`Chat with ${users[0].name}`}>
        <div className={styles.chatWindow}>
          <div className={styles.optionsUserWrapper}>
            <UserInfoComponent user={users[0]} />
            <div className={styles.options}>unfinished</div>
          </div>
          <div className={styles.window}>
            <Window />
          </div>
        </div>
      </main>
    </div>
  );
}

function ContactList() {
  return (
    <div className={styles.contactList}>
      <header className={styles.logo}>
        <Logo />
      </header>
      <nav className={styles.navContactList} aria-label="Contacts">
        <h2 className={styles.srOnly} >Contact List</h2>
        <div className={styles.options}>
          <OptionsSearchWrapper />
        </div>
        <ul className={styles.users}>
          {users.map((user) => (
            <li key={user.id}>
              <UserContact user={user} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Chat;
