import { useOutletContext } from "react-router";
import DefaultImage from "../../../util/DefaultImage";
import styles from "./profile.module.css";
import Icon from "@mdi/react";
import { mdiPencilOutline } from "@mdi/js";

function Profile() {
  const [user] = useOutletContext();
  return (
    <div className={styles.wrapper}>
      <h2>Profile</h2>
      <div className={styles.profileDetails}>
        <div className={styles.profilePicture}>
          {user.photoURL ? (
            <img src={user.photoURL} />
          ) : (
            <DefaultImage text={user.email} />
          )}
        </div>
        <div className={styles.nameLabel}>Name:</div>
        <div className={styles.profileName}>
          <div>{user.displayName ? user.displayName : "New User"}</div>
          <button>
            <Icon path={mdiPencilOutline} size={1} />
          </button>
        </div>
        <div className={styles.emailLabel}>E-mail:</div>
        <div className={styles.profileEmail}>
          {" "}
          <div>{user.email} </div>
          <button>
            <Icon path={mdiPencilOutline} size={1} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
