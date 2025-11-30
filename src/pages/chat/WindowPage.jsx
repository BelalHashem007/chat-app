import { listenToUserOnlineStatus } from "../../firebase/firebase_RTdb/rtdb";
import { subscribeToChatMessages } from "../../firebase/firebase_db/database";
import ContactInfoComponent from "../../components/chatComponents/chatwindow/ContactInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useState,useEffect } from "react";
import { useAuthContext } from "../../util/context";
import styles from "./chat.module.css"

function WindowPage({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuthContext();
  const [contactOnlineStatus, setContactOnlineStatus] = useState(null);
  
  let contact = null;

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

export default WindowPage;