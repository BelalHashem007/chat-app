import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import styles from "./messageInput.module.css";
import TextareaAutosize from "react-textarea-autosize";

function MessageInput() {
  const [msg, setMsg] = useState("");
  return (
    <form aria-label="Send a message" className={styles.wrapper}>
      <div className={styles.msgInputWrapper}>
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
      </div>
    </form>
  );
}

export default MessageInput;
