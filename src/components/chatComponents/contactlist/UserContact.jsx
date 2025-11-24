import Image from "./ImageComponent";
import styles from "./userContact.module.css";
function UserContact({ user }) {
  return (
    <button className={styles.userContactWrapper}>
      <Image url={user.url} />
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.lastMsgDate} aria-hidden="true">Msg date...</div>
        </div>
        <div className={styles.lastMsg} aria-hidden="true">Last message...</div>
      </div>
    </button>
  );
}

export default UserContact;
