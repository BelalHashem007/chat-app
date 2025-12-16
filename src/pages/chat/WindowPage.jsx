import { listenToUserOnlineStatus } from "../../firebase/firebase_RTdb/rtdb";
import ContactInfoComponent from "../../components/chatComponents/chatwindow/ContactInfoComponent";
import Window from "../../components/chatComponents/chatwindow/Window";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../util/context/authContext";
import styles from "./chat.module.css";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import useMessages from "../../util/hooks/useMessages";
import ChatOptions from "../../components/chatComponents/chatwindow/ChatOptions";

function WindowPage({
  selectedChat,
  setSelectedChat,
  isChatLoading,
  setIsChatLoading,
  userData
}) {
  const messages = useMessages(selectedChat);
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

    const unsubscribeStatus = listenToUserOnlineStatus(
      contact.uid,
      (status) => {
        setContactOnlineStatus(status);
      }
    );

    return () => {
      unsubscribeStatus();
    };
  }, [selectedChat, contact]);

  function handleBackOnSmallScreen() {
    setSelectedChat(null);
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
              <div className={styles.options}>
                <ChatOptions
                  setSelectedChat={setSelectedChat}
                  selectedChat={selectedChat}
                  contact={contact}
                  setIsChatLoading={setIsChatLoading}
                  isChatLoading={isChatLoading}
                />
              </div>
            </div>
          </header>
        )}
        <div className={styles.window}>
          <Window messages={messages} selectedChat={selectedChat} userData={userData}/>
        </div>
      </div>
    </main>
  );
}

export default WindowPage;
