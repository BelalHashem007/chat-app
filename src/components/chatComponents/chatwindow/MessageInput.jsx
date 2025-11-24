import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import styles from "./messageInput.module.css";

function MessageInput() {
  const [msg, setMsg] = useState("");
  return (
    <form aria-label="Send a message">
      <div className={styles.msgInputWrapper}>
        <div className={styles.mirror}>{msg || " "}</div>
        <textarea
          name="message"
          id="message"
          className={styles.msgInput}
          placeholder="Message"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        ></textarea>
        <button className={styles.sendBtn} type="submit" title="Send">
          <Icon path={mdiSendVariantOutline} size={"30px"} color={"white"} />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
