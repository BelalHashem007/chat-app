import { useState, useEffect } from "react";
import { subscribeToChatMessages } from "../../firebase/firebase_db/database";

function useMessages(selectedChat) {
  const [messages, setMessages] = useState([]);

  //subscribe to chat messages
  useEffect(() => {
    if (!selectedChat) return;


    const unsubscribe = subscribeToChatMessages(
      selectedChat.id,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
      }
    );

    return () => {
      setMessages([]);
      unsubscribe();
    };
  }, [selectedChat]);

  return messages;
}

export default useMessages;
