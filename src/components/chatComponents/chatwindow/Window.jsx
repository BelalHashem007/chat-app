import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";
import { useEffect, useRef } from "react";

function Window({ messages, selectedChat,userData }) {
  const scrolWrapperRef = useRef(null);

  useEffect(() => {
    if (scrolWrapperRef.current) {
      scrolWrapperRef.current.scrollTop = scrolWrapperRef.current.scrollHeight;
    }
  }, [messages]);
  //get current contact messages
  if (!selectedChat) {
    return (
      <div className={`${styles.windowbg} ${styles.notActive}`}>
        <div className={styles.notActiveWrapper} data-testid="notActiveWrapper">
          <p>You haven`t started a chat yet!</p>
          <p>Click on a contact/group to start chatting.</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`${styles.windowbg} ${styles.active}`} data-testid="WindowWrapper">
      <div className={styles.ScrollWrapper} ref={scrolWrapperRef}>
          <div className={styles.flexWrapper}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                selectedChat={selectedChat}
              />
            ))}
          </div>
      </div>
      <MessageInput selectedChat={selectedChat} userData={userData}/>
    </div>
  );
}

export default Window;
