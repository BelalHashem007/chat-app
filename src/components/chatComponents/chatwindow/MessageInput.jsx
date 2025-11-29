import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import styles from "./messageInput.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context";
import EmojiPicker from "emoji-picker-react";

function MessageInput({ selectedChat }) {
  const [msg, setMsg] = useState("");
  const { user } = useAuthContext();
  const [openEmoji, setOpenEmoji] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg || !msg.trim() || !user || !selectedChat) return;
    setMsg("");
    await sendMessage(msg, selectedChat.id, user);
  }

  function handleEmoji(emojieData){
    console.log(emojieData.emoji)
    setMsg((msg)=>msg+emojieData.emoji)
  }

  return (
    <>
      <form
        aria-label="Send a message"
        className={styles.wrapper}
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
      >
        <button
          className={styles.emojiBtn}
          title="Emoji"
          onClick={() => {
            setOpenEmoji(!openEmoji);
          }}
          type="button"
        >
          🙂
        </button>
        <div className={styles.emojiWrapper}>
          <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji}/>
        </div>
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
    </>
  );
}

export default MessageInput;
