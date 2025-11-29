import styles from "./contactInfoComponent.module.css";
import DefaultImage from "../../../util/DefaultImage";

function ContactInfoComponent({ contact,contactOnlineStatus }) {
  if (!contact ) return;
  return (
    <div className={styles.userContactWrapper}>
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
          <header>
            <h2 className={styles.name}>{contact.displayName ? contact.displayName : "New User"}</h2>
          </header>
          <div className={styles.onlineStatus}>{contactOnlineStatus ? contactOnlineStatus.state : "offline"}</div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoComponent;
