import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import UserInfoComponent from "../../components/chatComponents/chatwindow/UserInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useEffect, useState } from "react";
import Sidebar from "../../components/chatComponents/sidebar/Sidebar";
import Profile from "../../components/chatComponents/profile/Profile";
import { useOutletContext } from "react-router";
import { subscribeToUserChats } from "../../firebase/firebase_db/database";

const users = [
  { id: 1, name: "mohamed" },
  { id: 2,  name: "Ahmed" },
  { id: 3, name: "Belal" },
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
  const [showProfile, setShowProfile] = useState(false);
  const [user] = useOutletContext();
  console.log(user)
  return (
    <div className={styles.chatWrapper}>
      <Sidebar setShowProfile={setShowProfile}/>
      {showProfile ? (
        <Profile />
      ) : (
        <ContactList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}
      <WindowPage messages={messages}  />
    </div>
  );
}

function WindowPage({ messages, user }) {
  return (
    <main aria-label={`${user ? `Chat with ${user.name}` : "Empty chat"}`}>
      <div className={styles.chatWindow}>
        {user && messages && (
          <div className={styles.optionsUserWrapper}>
            <UserInfoComponent user={user} />
            <div className={styles.options}>unfinished</div>
          </div>
        )}
        <div className={styles.window}>
          <Window messages={null} />
        </div>
      </div>
    </main>
  );
}

function ContactList({ selectedUser, setSelectedUser }) {
  const [user] = useOutletContext();
  const [chats,setChats] = useState([])
  console.log(chats)
  useEffect(()=>{
     const unsubscribe =  subscribeToUserChats(user.uid,(fetchedChats)=>{
      setChats(fetchedChats)
    })

    return ()=> {unsubscribe()};
  },[user])

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
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => {
                setSelectedUser(chat.id);
              }}
              className={`${
                selectedUser == chat.id ? styles.activeContact : ""
              }`}
            >
              {<UserContact chat={chat} curUserUid={user.uid} />}
            </li>
          ))}
        </ul>
        {chats.length == 0 && <p>No active chats. Start a new conversation!</p>}
      </nav>
    </div>
  );
}

export default Chat;
