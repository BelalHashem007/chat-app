import Icon from "@mdi/react";
import { mdiArrowLeft, mdiAccountMultiple, mdiCheck } from "@mdi/js";
import styles from "./otherGroupOptions.module.css";
import { useState } from "react";
import { createNewChatRoom } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context/authContext";
import { useToastContext } from "../../../util/context/toastContext";

function OtherGroupOptions({
  setShowOptions,
  selectedContacts,
  handleClosingAddGroup,
}) {
  const { user } = useAuthContext();
  const [groupName, setGroupName] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);
  const { showToast } = useToastContext();

  async function handleSubmit() {
    const adminUids = [user.uid];
    setCreatingChat(true);
    const result = await createNewChatRoom(
      user,
      [...selectedContacts, user],
      true,
      groupName,
      adminUids
    );
    if (result.error) {
      showToast(<p>Something went wrong. Please try again.</p>);
    }
    if (result.isChatCreated) {
      showToast(<p>Your group has been created.</p>);
      handleClosingAddGroup();
      setShowOptions(false);
    }
    setCreatingChat(false);
  }

  return (
    <>
      <button
        title="back"
        className={styles.backBtn}
        onClick={() => {
          setShowOptions(false);
        }}
        data-testid="backBtn"
      >
        <Icon path={mdiArrowLeft} size={1} />
      </button>

      <div className={styles.groupIcon}>
        <Icon path={mdiAccountMultiple} />
      </div>

      <label htmlFor="groupName" className={styles.srOnly}>
        Group Name
      </label>
      <input
        type="text"
        name="groupName"
        id="groupName"
        className={styles.groupNameInp}
        value={groupName}
        placeholder="Group name"
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        type="button"
        aria-label={
          groupName.length == 0
            ? "You have to write a name for the group"
            : "create group"
        }
        disabled={groupName.length == 0 || creatingChat}
        title={
          groupName.length == 0
            ? "You have to write a name for the group"
            : "submit"
        }
        data-testid="submitBtn"
      >
        <Icon path={mdiCheck} size={1.25} />
      </button>
      {creatingChat && (
        <p data-testid="loadingForCreatingChat">Creating group...</p>
      )}
    </>
  );
}

export default OtherGroupOptions;
