import styles from "./messageBubble.module.css";

function MessageBubble({ msg }) {
  return (
    <section aria-label="Messages" role="log"
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
    </section>
  );
}

export default MessageBubble;
