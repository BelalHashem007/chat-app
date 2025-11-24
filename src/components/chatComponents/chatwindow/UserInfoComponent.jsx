import styles from "./userInfoComponent.module.css";
import Image from "../contactlist/ImageComponent";

function UserInfoComponent({ user }) {
  return (
    <div className={styles.userContactWrapper}>
      <img src={user.url} alt={user.name} className={styles.userImg}/>
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <header>
            <h2 className={styles.name}>{user.name}</h2>
          </header>
          <div className={styles.lastOnline}>Last online...</div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoComponent;
