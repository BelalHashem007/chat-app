import styles from "./contact.module.css";
import DefaultImage from "../../../util/DefaultImage";
import { getMessageDate } from "../../../util/utilFunctions";
import Icon from "@mdi/react";
import { mdiAccountMultiple } from "@mdi/js";

function Contact({ chat, curUserUid }) {
  if (!chat || !curUserUid) return;
  
  const contact = chat.enrichedParticipants.filter(
    (user) => curUserUid != user.uid
  )[0];

  let name = contact.displayName || "New User";

  if (chat.isGroupChat) {
    name = chat.groupName;
  }

  const lastMsgSender =
    chat.lastMessage &&
    (chat.lastMessageSenderUid == curUserUid
      ? "You"
      : chat.lastMessageSenderDisplayName || "New User");
  return (
    <button className={styles.userContactWrapper} data-testid="contactWrapper">
      {chat.isGroupChat ? (
        <div className={styles.userImg} data-testid="userImgGroup">
          <div className={styles.groupImg}>
          <Icon path={mdiAccountMultiple}/>
          </div>
        </div>
      ) : contact.photoURL ? (
        <img
          src={contact.photoURL}
          alt={contact.displayName}
          className={styles.userImg}
        />
      ) : (
        <div className={styles.userImg} data-testid="userImgDm">
          {" "}
          <DefaultImage text={contact.email || contact.displayName} />
        </div>
      )}
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name} data-testid="contactName">
            {name}
            {contact.isAnonymous && <span className={styles.guestId}> #{contact.guestId}</span>}
          </div>
          <div className={styles.lastMsgDate} aria-hidden="true" data-testid="lastMsgDate">
            {getMessageDate(chat.lastMessageDate)}
          </div>
        </div>
        <div className={styles.lastMsg} aria-hidden="true" data-testid="lastMsg">
          {chat.lastMessage && lastMsgSender + ": " + chat.lastMessage}
        </div>
      </div>
    </button>
  );
}

export default Contact;
