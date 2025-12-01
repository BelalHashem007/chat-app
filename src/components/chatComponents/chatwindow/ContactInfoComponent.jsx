import styles from "./contactInfoComponent.module.css";
import DefaultImage from "../../../util/DefaultImage";
import Icon from "@mdi/react";
import { mdiAccountMultiple } from "@mdi/js";

function ContactInfoComponent({ contact, contactOnlineStatus, selectedChat }) {
  if (!selectedChat.isGroupChat && !contact) return;
  return (
    <div className={styles.userContactWrapper}>
      {selectedChat.isGroupChat ? (
        <div className={styles.userImg}>
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
        <div className={styles.userImg}>
          {" "}
          <DefaultImage text={contact.email} />
        </div>
      )}
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <header>
            <h2 className={styles.name}>
              {selectedChat.isGroupChat
                ? selectedChat.groupName
                : contact.displayName
                ? contact.displayName
                : "New User"}
            </h2>
          </header>
          {!selectedChat.isGroupChat && (
            <div className={styles.onlineStatus}>
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
