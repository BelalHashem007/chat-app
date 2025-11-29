import styles from "./messageBubble.module.css";
import { useAuthContext } from "../../../util/context";

function MessageBubble({ msg }) {
  const {user} = useAuthContext();
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
