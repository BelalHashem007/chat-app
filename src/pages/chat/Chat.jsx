import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import ContactInfoComponent from "../../components/chatComponents/chatwindow/ContactInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useEffect, useState } from "react";
import Sidebar from "../../components/chatComponents/sidebar/Sidebar";
import Profile from "../../components/chatComponents/profile/Profile";
import { useOutletContext } from "react-router";
import {
  subscribeToChatMessages,
  subscribeToUserChats,
} from "../../firebase/firebase_db/database";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className={styles.chatWrapper}>
      <Sidebar setShowProfile={setShowProfile} />
      {showProfile ? (
        <Profile />
      ) : (
        <ContactList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      )}
      <WindowPage selectedChat={selectedChat} />
    </div>
  );
}

function WindowPage({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [user] = useOutletContext();
  let contact = null;
  console.log(messages)

  useEffect(() => {
    if (!selectedChat) return;

    const unsubscribe = subscribeToChatMessages(
      selectedChat.id,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedChat]);

  if (selectedChat) {
    contact = selectedChat.enrichedParticipants.filter(
      (participant) => user.uid !== participant.uid
    )[0];
  }

  return (
    <main
      aria-label={`${contact ? `Chat with ${contact.email}` : "Empty chat"}`}
    >
      <div className={styles.chatWindow}>
        {selectedChat && (
          <div className={styles.optionsUserWrapper}>
            <ContactInfoComponent contact={contact} />
            <div className={styles.options}>unfinished</div>
          </div>
        )}
        <div className={styles.window}>
          <Window messages={messages} selectedChat={selectedChat} />
        </div>
      </div>
    </main>
  );
}

function ContactList({ selectedChat, setSelectedChat }) {
  const [user] = useOutletContext();
  const [chats, setChats] = useState([]);
  console.log(chats);
  useEffect(() => {
    const unsubscribe = subscribeToUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

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
        {chats.length == 0 && <p>No active chats. Start a new conversation!</p>}
      </nav>
    </div>
  );
}

export default Chat;
