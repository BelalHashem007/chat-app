import DefaultImage from "../../../util/DefaultImage";
import styles from "./profile.module.css";
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiCheck } from "@mdi/js";
import { useState } from "react";
import { updateUserName } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context/authContext";

function Profile({ userData }) {
  const { user } = useAuthContext();

  const [nameEditable, setNameEditable] = useState(false);
  const [name, setName] = useState(userData.displayName);

  //handlers
  async function handleUpdate() {
    setNameEditable(false);
    await updateUserName(user.uid, name);
  }

  return (
    <div className={styles.wrapper}>
      <h2>Profile</h2>
      <div className={styles.profileDetails}>
        <div className={styles.profilePicture}>
          {userData.photoURL ? (
            <img src={userData.photoURL} />
          ) : (
            <DefaultImage text={userData.email || userData.displayName} />
          )}
        </div>
        <div className={styles.nameLabel}>Name:</div>
        <div className={styles.profileName}>
          {nameEditable ? (
            <>
              <label htmlFor="name" className={styles.srOnly}>
                Edit name
              </label>
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
              <button
                onClick={handleUpdate}
                title="update name"
                aria-label="update name"
                data-testid="updateBtn"
              >
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
                data-testid="editBtn"
                aria-label="edit name"
                title="edit name"
              >
                <Icon path={mdiPencilOutline} size={1} />
              </button>
            </>
          )}
        </div>
        {!userData.isAnonymous ? (
          <>
            <div className={styles.emailLabel}>E-mail:</div>
            <div className={styles.profileEmail}>
              <div>{userData.email} </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.emailLabel}>Guest id:</div>
            <div className={styles.profileEmail}>
              <div>{userData.guestId}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
