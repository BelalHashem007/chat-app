import styles from "./messageBubble.module.css";

function MessageBubble({ msg }) {
  return (
    <div
      className={`${styles.chatBubble} ${
        msg.user !== 1 ? styles.curUser : ""
      } `}
    >
      <div
        className={`${styles.msgWrapper} ${
          msg.user !== 1 ? styles.curUser : ""
        }`}
      >
        <div className={`${styles.message} `}>{msg.text}</div>
        <div className={styles.messageDate}>{msg.date}</div>
      </div>
    </div>
  );
}

export default MessageBubble;
