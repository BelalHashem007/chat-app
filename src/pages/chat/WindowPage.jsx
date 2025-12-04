import { listenToUserOnlineStatus } from "../../firebase/firebase_RTdb/rtdb";
import ContactInfoComponent from "../../components/chatComponents/chatwindow/ContactInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../util/context/authContext";
import styles from "./chat.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import useMessages from "../../util/hooks/useMessages";

function WindowPage({ selectedChat,setSelectedChat }) {
  const messages = useMessages(selectedChat)
  const { user } = useAuthContext();
  const [contactOnlineStatus, setContactOnlineStatus] = useState(null);

  let contact = null;

  if (selectedChat && !selectedChat.isGroupChat) {
    //get contact details IF dms
    if (user) {
      contact = selectedChat.enrichedParticipants.filter(
        (participant) => user.uid !== participant.uid
      )[0];
    }
  }

  //subscribe to dms online status
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

  function handleBackOnSmallScreen() {
    setSelectedChat(null)
  }

  return (
    <main
      aria-label={`${contact ? `Chat with ${contact.email}` : "Empty chat"}`}
      className={selectedChat && styles.show}
    >
      <div className={styles.chatWindow}>
        {selectedChat && (
          <header>
            <div className={styles.optionsUserWrapper}>
              <div className={styles.contactBackWrapper}>
                <button
                  className={`${styles.backToContact}`}
                  title="back"
                  aria-label="back"
                  onClick={handleBackOnSmallScreen}
                >
                  <Icon path={mdiArrowLeft} size={1} />
                </button>
                <ContactInfoComponent
                  contact={contact}
                  contactOnlineStatus={contactOnlineStatus}
                  selectedChat={selectedChat}
                />
              </div>
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
