import styles from "./messageBubble.module.css";
import { useAuthContext } from "../../../util/context";
import getMessageDate from "../../../util/getMessageDate";

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
        <div className={styles.messageDate}>{getMessageDate(msg.timestamp,{forChatWindow:true})}</div>
      </div>
    </section>
  );
}

export default MessageBubble;
