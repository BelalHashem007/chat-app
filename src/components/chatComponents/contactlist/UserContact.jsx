import Image from "./ImageComponent";
import styles from "./userContact.module.css";
function UserContact({ user }) {
  return (
    <div className={styles.userContactWrapper}>
      <Image url={user.url} />
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.lastMsgDate}>Msg date...</div>
        </div>
        <div className={styles.lastMsg}>Last message...</div>
      </div>
    </div>
  );
}

export default UserContact;
