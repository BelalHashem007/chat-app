import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";

function Window({ messages, selectedChat }) {
  //get current contact messages
  if (!messages) {
    return (
      <div className={`${styles.windowbg} ${styles.notActive}`}>
        <div className={styles.notActiveWrapper}>
          <div>You haven`t started a chat yet!</div>
          <div>Click on a contact to start chatting.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.windowbg} ${styles.active}`}>
      <div className={styles.ScrollWrapper}>
        <div className={styles.flexWrapper}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </div>
      </div>
      <MessageInput selectedChat={selectedChat} />
    </div>
  );
}

export default Window;
