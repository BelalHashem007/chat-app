import styles from "./messageBubble.module.css";
import { useOutletContext } from "react-router";

function MessageBubble({ msg }) {
  console.log(msg)
  const [user] = useOutletContext();
  return (
    <section aria-label="Messages" role="log"
      className={`${styles.chatBubble} ${
        msg.senderUid == user.uid ? styles.curUser : ""
      } `}
    >
      <div
        className={`${styles.msgWrapper} ${
          msg.senderUid == user.uid ? styles.curUser : ""
        }`}
      >
        <div className={`${styles.message} `}>{msg.text}</div>
        <div className={styles.messageDate}>{new Date( msg.timestamp.seconds*1000).toLocaleTimeString( [],
              {
                hour: "2-digit",
                minute: "2-digit",
              })}</div>
      </div>
    </section>
  );
}

export default MessageBubble;
