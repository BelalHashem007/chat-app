import { useState } from "react";
import styles from "./chatOptions.module.css";
import { useAuthContext } from "../../../util/context/authContext";
import {
  removeContact,
  leaveGroup,
  deleteGroup
} from "../../../firebase/firebase_db/database";
import { useToastContext } from "../../../util/context/toastContext";
import useClickOutside from "../../../util/hooks/useClickOutside";

function ChatOptions(props) {
  const { user } = useAuthContext();
  const [isOptionOpen, setIsOptionsOpen] = useState(false);
  const { showToast } = useToastContext();
  const optionsRef = useClickOutside(setIsOptionsOpen);

  const showDeleteGroup =
    props.selectedChat.isGroupChat &&
    props.selectedChat.adminUids.includes(user.uid);

  function handleOptionsBtn() {
    setIsOptionsOpen(!isOptionOpen);
  }

  async function handleRemoveContact() {
    props.setIsChatLoading(true);
    const result = await removeContact(
      props.selectedChat.id,
      props.userData,
      props.contact.uid
    );

    if (result.error) {
      showToast(<p style={{ color: "red" }}>Failed to remove a contact.</p>);
    }

    if (result.isRemoved) {
      props.setSelectedChat(null);
      showToast(<p>Contact has been removed.</p>);
    }

    props.setIsChatLoading(false);
  }

  async function handleLeaveGroup() {
    props.setIsChatLoading(true);

    const result = await leaveGroup(props.selectedChat, user.uid);
    if (result.error) {
      showToast(<p style={{ color: "red" }}>Failed to leave group.</p>);
    }

    if (result.didLeave) {
      props.setSelectedChat(null);
      showToast(<p>You have left the group.</p>);
    }

    props.setIsChatLoading(false);
  }

  async function handleDeleteGroup(){
     props.setIsChatLoading(true);

    const result = await deleteGroup(props.selectedChat, props.userData);
    if (result.error) {
      showToast(<p style={{ color: "red" }}>Failed to delete group.</p>);
    }

    if (result.isDeleted) {
      props.setSelectedChat(null);
      showToast(<p>Group is deleted successfully.</p>);
    }

    props.setIsChatLoading(false);
  }

  return (
    <div className={styles.optionsWrapper} ref={optionsRef}>
      <button
        className={styles.optionsBtn}
        title="chat options"
        aria-label="chat options"
        onClick={handleOptionsBtn}
        data-testid="optionsBtn"
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </button>
      {isOptionOpen && <div className={`${styles.optionsBody}`}>
        {showDeleteGroup && (
          <button disabled={props.isChatLoading} onClick={handleDeleteGroup} data-testid="DeleteGroupBtn">Delete group</button>
        )}
        {!props.selectedChat.isGroupChat && (
          <button onClick={handleRemoveContact} disabled={props.isChatLoading} data-testid="RemoveContactBtn">
            Remove contact
          </button>
        )}
        {props.selectedChat.isGroupChat && props.selectedChat.activeParticipantsUids.length > 1 && (
          <button disabled={props.isChatLoading} onClick={handleLeaveGroup} data-testid="LeaveGroupBtn">
            Leave group
          </button>
        )}
      </div>}
    </div>
  );
}

export default ChatOptions;
