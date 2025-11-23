import styles from "./userInfoComponent.module.css"
import Image from "../contactlist/ImageComponent";

function UserInfoComponent({user}){
return (
    <div className={styles.userContactWrapper}>
      <Image url={user.url} />
      <div className={styles.nameWrapper}>
        <div className={styles.nameDateWrapper}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.lastOnline}>Last online...</div>
        </div>
        
      </div>
    </div>
  );
}

export default UserInfoComponent