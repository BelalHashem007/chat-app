import styles from "./messageBubble.module.css";
import { useAuthContext } from "../../../util/context/authContext";
import getMessageDate from "../../../util/getMessageDate";
import DefaultImage from "../../../util/DefaultImage";
import { pickPaletteColor } from "../../../util/utilFunctions";

function MessageBubble({ msg, selectedChat }) {
  const { user } = useAuthContext();
  if (msg && msg.chatId != selectedChat.id) return <div></div>;

  let senderEmail = null;
  let senderDisplayName = null;
  let userNameColor = null;

  if (!msg.isSystem) {
    if (selectedChat.isGroupChat && msg.senderUid != user.uid) {
      const senderDetails = selectedChat.enrichedParticipants.filter(
        (participants) => participants.uid == msg.senderUid
      );
      senderEmail = senderDetails[0].email;
      senderDisplayName = senderDetails[0].displayName;
      userNameColor = pickPaletteColor(senderEmail || senderDisplayName);
    }
  }
  return (
    <section
      aria-label="Message"
      role="log"
      className={`${styles.chatBubble} ${
        msg.senderUid == user.uid ? styles.curUser : ""
      } ${msg.isSystem && styles.systemWrapper}`}
    >
      {msg.isSystem ? (
        <div className={styles.systemMsg}>{msg.text}</div>
      ) : (
        <>
          {selectedChat.isGroupChat && msg.senderUid != user.uid && (
            <div className={styles.userImg}>
              <DefaultImage text={senderEmail || senderDisplayName} />
            </div>
          )}
          <div
            className={`${styles.msgWrapper} ${
              msg.senderUid == user.uid ? styles.curUser : ""
            }`}
          >
            <div>
              {selectedChat.isGroupChat && msg.senderUid != user.uid && (
                <div
                  style={{
                    color: userNameColor,
                    fontSize: "0.875rem",
                    marginBottom: "3px",
                  }}
                >
                  {msg.senderDisplayName}
                </div>
              )}
              <p className={`${styles.message} `}>{msg.text}</p>
            </div>
            <div className={styles.messageDate}>
              {getMessageDate(msg.timestamp, { forChatWindow: true })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default MessageBubble;
