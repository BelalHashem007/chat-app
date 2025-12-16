import styles from "./contactInfoComponent.module.css";
import DefaultImage from "../../../util/DefaultImage";
import Icon from "@mdi/react";
import { mdiAccountMultiple } from "@mdi/js";
import { useAuthContext } from "../../../util/context/authContext";

function ContactInfoComponent({ contact, contactOnlineStatus, selectedChat }) {
  const { user } = useAuthContext();

  if (!selectedChat || (!selectedChat.isGroupChat && !contact)) return;

  let name = "New User";
  if (contact) {
    name = contact.displayName;
  }

  if (selectedChat.isGroupChat) {
    name = selectedChat.groupName;
  }

  return (
    <div className={styles.userContactWrapper} data-testid="contactInfoWrapper">
      {selectedChat.isGroupChat ? (
        <div className={styles.userImg} data-testid="groupImg">
          <div className={styles.groupImg}>
            <Icon path={mdiAccountMultiple} />
          </div>
        </div>
      ) : contact.photoURL ? (
        <img
          src={contact.photoURL}
          alt={contact.displayName}
          className={styles.userImg}
        />
      ) : (
        <div className={styles.userImg} data-testid="contactImg">
          {" "}
          <DefaultImage text={contact.email || contact.displayName} />
        </div>
      )}
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <header className={styles.chatWindowHeader} data-testid="contactName">
            <h2 className={styles.name}>{name}</h2>
            {contact && contact.isAnonymous && (
              <span className={styles.guestId}>#{contact.guestId}</span>
            )}
          </header>
          {selectedChat.isGroupChat && (
            <div className={styles.groupParticipants}>
              <div className={styles.groupParticipantsTitle}>
              {selectedChat.enrichedParticipants.map((participant,index) => {
                return (
                  <span>
                    {participant.uid == user.uid
                      ? "You"
                      : participant.displayName}
                      {index==selectedChat.enrichedParticipants.length-1 ? ".":", "}
                  </span>
                );
              })}</div>
              <div className={styles.groupParticipantsNames}>{selectedChat.enrichedParticipants.map((participant) => {
                return (
                  <div>
                    {participant.uid == user.uid
                      ? participant.displayName+" (You)"
                      : participant.displayName}
                  </div>
                );
              })}</div>
            </div>
          )}
          {!selectedChat.isGroupChat && (
            <div className={styles.onlineStatus} data-testid="contactStatus">
              <span
                className={`${styles.dot} ${
                  contactOnlineStatus && contactOnlineStatus.state === "online"
                    ? styles.online
                    : styles.offline
                }`}
              ></span>
              {contactOnlineStatus && contactOnlineStatus.state}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInfoComponent;
