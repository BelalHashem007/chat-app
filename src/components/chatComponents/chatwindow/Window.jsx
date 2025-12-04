import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";
import { useEffect, useRef } from "react";

function Window({ messages, selectedChat }) {
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
        <div className={styles.notActiveWrapper}>
          <div>You haven`t started a chat yet!</div>
          <div>Click on a contact to start chatting.</div>
        </div>
      </div>
    );
  }
  console.log(messages);
  return (
    <div className={`${styles.windowbg} ${styles.active}`}>
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
      <MessageInput selectedChat={selectedChat} />
    </div>
  );
}

export default Window;
