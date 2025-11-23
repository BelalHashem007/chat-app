import styles from "./messageBubble.module.css";

function MessageBubble({msg}) {
  return (
    <div className={`${styles.chatBubble} ${msg.user !== 1 ? styles.curUser : ""} `}>
      <div className={`${styles.message} ${msg.user !== 1 ? styles.curUser : ""}`}>
        {msg.text}
      </div>
    </div>
  );
}

export default MessageBubble