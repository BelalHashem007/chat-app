import styles from "./userContact.module.css";
import DefaultImage from "../../../util/DefaultImage";

function UserContact({ chat, curUserUid }) {
  if (!chat || !curUserUid) return;


  const contact = chat.enrichedParticipants.filter(
    (user) => curUserUid != user.uid
  )[0];

  const lastMsg = chat.lastMessage ? (chat.lastMessageSenderUid == curUserUid ? "You:" : contact.displayName || "New User" +": "+ chat.lastMessage) : "";

  return (
    <button className={styles.userContactWrapper}>
      {contact.photoURL ? (
        <img
          src={contact.photoURL}
          alt={contact.displayName}
          className={styles.userImg}
        />
      ) : (
        <div className={styles.userImg}>
          {" "}
          <DefaultImage text={contact.email} />
        </div>
      )}
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name}>
            {contact.displayName ? contact.displayName : "New User"}
          </div>
          <div className={styles.lastMsgDate} aria-hidden="true">
            {new Date(chat.lastMessageDate.seconds * 1000).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </div>
        </div>
        <div className={styles.lastMsg} aria-hidden="true">{lastMsg}</div>
      </div>
    </button>
  );
}

export default UserContact;
