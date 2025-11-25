import styles from "./userContact.module.css";
import DefaultImage from "../../../util/DefaultImage";
function UserContact({ user }) {
  return (
    <button className={styles.userContactWrapper}>
      {user.url ? (
        <img src={user.url} alt={user.name} className={styles.userImg} />
      ) : (
        <div className={styles.userImg}> <DefaultImage user={{ email: user.name }} /></div>
      )}
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.lastMsgDate} aria-hidden="true">
            Msg date...
          </div>
        </div>
        <div className={styles.lastMsg} aria-hidden="true">
          Last message...
        </div>
      </div>
    </button>
  );
}

export default UserContact;
