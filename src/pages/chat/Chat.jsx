import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import userAvatar from "../../assets/Avatar.png";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import UserInfoComponent from "../../components/chatComponents/chatwindow/UserInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useState } from "react";

const users = [
  { id: 1, url: userAvatar, name: "mohamed" },
  { id: 2, url: userAvatar, name: "Ahmed" },
  { id: 3, url: userAvatar, name: "Belal" },
];
const messages = [
  { id: 1, text: "Oldest message", user: 1, date: "11:37 AM" },
  { id: 2, text: "Middle message", user: 1, date: "2:05 PM" },
  { id: 3, text: "newest message", user: 2, date: "5:24 PM" },
  { id: 4, text: "muahaha message", user: 2, date: "10:02 PM" },
  { id: 5, text: "1sdasde", user: 1, date: "7:33 AM" },
  { id: 6, text: "Oxxxxxxxxx", user: 1, date: "4:44 AM" },
];

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  let user = null;
  if (selectedUser) {
    user = users[selectedUser-1];
  }
  return (
    <div className={styles.chatWrapper}>
      <ContactList
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <WindowPage messages={messages} user={user}/>
    </div>
  );
}

function WindowPage({ messages,user }) {
  return (
    <main aria-label={`${user ? `Chat with ${user.name}`: 'Empty chat'}`}>
      <div className={styles.chatWindow}>
        {user && messages && (
          <div className={styles.optionsUserWrapper}>
            <UserInfoComponent user={user} />
            <div className={styles.options}>unfinished</div>
          </div>
        )}
        <div className={styles.window}>
          <Window messages={messages} />
        </div>
      </div>
    </main>
  );
}

function ContactList({ selectedUser, setSelectedUser }) {
  return (
    <div className={styles.contactList}>
      <header className={styles.logo}>
        <Logo />
      </header>
      <nav className={styles.navContactList} aria-label="Contacts">
        <h2 className={styles.srOnly}>Contact List</h2>
        <div className={styles.options}>
          <OptionsSearchWrapper />
        </div>
        <ul className={styles.users}>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setSelectedUser(user.id);
              }}
              className={`${
                selectedUser == user.id ? styles.activeContact : ""
              }`}
            >
              <UserContact user={user} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Chat;
