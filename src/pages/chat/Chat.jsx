import styles from "./chat.module.css";
import UserContact from "../../components/chatComponents/contactlist/UserContact";
import OptionsSearchWrapper from "../../components/chatComponents/contactlist/OptionsSearchWrapper";
import Logo from "../../components/chatComponents/logo/LogoComponent";
import ContactInfoComponent from "../../components/chatComponents/chatwindow/ContactInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useEffect, useState } from "react";
import Sidebar from "../../components/chatComponents/sidebar/Sidebar";
import Profile from "../../components/chatComponents/profile/Profile";
import { useAuthContext } from "../../util/context";
import {
  subscribeToChatMessages,
  subscribeToUserChats,
} from "../../firebase/firebase_db/database";
import { listenToUserOnlineStatus } from "../../firebase/firebase_RTdb/rtdb";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [chats, setChats] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const unsubscribe = subscribeToUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className={styles.chatWrapper}>
      <Sidebar setShowProfile={setShowProfile} />
      {showProfile ? (
        <Profile />
      ) : (
        <ContactList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          chats={chats}
        />
      )}
      <WindowPage selectedChat={selectedChat} />
    </div>
  );
}

function WindowPage({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuthContext();
  const [contactOnlineStatus, setContactOnlineStatus] = useState(null);

  let contact = null;
  console.log(messages);

  if (selectedChat && user) {
    contact = selectedChat.enrichedParticipants.filter(
      (participant) => user.uid !== participant.uid
    )[0];
  }

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

  useEffect(() => {
    if (!selectedChat || !contact) {
      return;
    }

    console.log(`Setting up status listener for contact: ${contact.uid}`);

    const unsubscribeStatus = listenToUserOnlineStatus(
      contact.uid,
      (status) => {
        console.log(`Contact ${contact.uid} status update:`, status);
        setContactOnlineStatus(status);
      }
    );

    return () => {
      console.log(`Cleaning up status listener for contact: ${contact.uid}`);
      unsubscribeStatus();
    };
  }, [selectedChat, contact]);

  return (
    <main
      aria-label={`${contact ? `Chat with ${contact.email}` : "Empty chat"}`}
    >
      <div className={styles.chatWindow}>
        {selectedChat && (
          <header>
            <div className={styles.optionsUserWrapper}>
              <ContactInfoComponent
                contact={contact}
                contactOnlineStatus={contactOnlineStatus}
              />
              <div className={styles.options}>unfinished</div>
            </div>
          </header>
        )}
        <div className={styles.window}>
          <Window messages={messages} selectedChat={selectedChat} />
        </div>
      </div>
    </main>
  );
}

function ContactList({ selectedChat, setSelectedChat,chats }) {
  const { user } = useAuthContext();

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
      </nav>
    </div>
  );
}

export default Chat;
