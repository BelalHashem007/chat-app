import { useOutletContext } from "react-router";
import DefaultImage from "../../../util/DefaultImage";
import styles from "./profile.module.css";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiCheck } from "@mdi/js";
import { useState } from "react";
import { updateUserName } from "../../../firebase/firebase_db/database";

function Profile() {
  const [user] = useOutletContext();
  const [nameEditable, setNameEditable] = useState(false);
  const [name, setName] = useState(user.displayName || "New User");

  async function handleUpdate() {
    setNameEditable(false);
    await updateUserName(user.uid, name);
  }

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
          {nameEditable ? (
            <>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <button onClick={handleUpdate}>
                <Icon path={mdiCheck} size={1} />
              </button>
            </>
          ) : (
            <>
              <div>{name}</div>
              <button
                onClick={() => {
                  setNameEditable(true);
                }}
              >
                <Icon path={mdiPencilOutline} size={1} />
              </button>
            </>
          )}
        </div>
        <div className={styles.emailLabel}>E-mail:</div>
        <div className={styles.profileEmail}>
          {" "}
          <div>{user.email} </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
