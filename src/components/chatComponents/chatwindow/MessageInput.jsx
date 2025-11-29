import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import styles from "./messageInput.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context";

function MessageInput({ selectedChat }) {
  const [msg, setMsg] = useState("");
  const {user}= useAuthContext();

  async function handleSumbit(e) {
    e.preventDefault();
    console.log(selectedChat);
    if (!msg || !msg.trim() || !user || !selectedChat) return;
    setMsg("");
    await sendMessage(msg, selectedChat.id, user);
  }

  return (
    <form
      aria-label="Send a message"
      className={styles.wrapper}
      onSubmit={handleSumbit}
      onKeyDown={(e)=>{
        if (e.key=="Enter"){
          handleSumbit(e);
        }
      }}
    >
        <TextareaAutosize
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          minRows={1}
          maxRows={5}
          className={styles.msgInput}
          placeholder="Message"
        />
        <button className={styles.sendBtn} type="submit" title="Send">
          <Icon path={mdiSendVariantOutline} size={"30px"} color={"white"} />
        </button>
    </form>
  );
}

export default MessageInput;
