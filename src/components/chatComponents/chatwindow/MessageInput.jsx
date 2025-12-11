import { useState } from "react";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import styles from "./messageInput.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { sendMessage } from "../../../firebase/firebase_db/database";
import { useAuthContext } from "../../../util/context/authContext";
import EmojiPicker from "emoji-picker-react";
import useClickOutside from "../../../util/hooks/useClickOutside";

function MessageInput({ selectedChat }) {
  const [msg, setMsg] = useState("");
  const { user } = useAuthContext();
  const [openEmoji, setOpenEmoji] = useState(false);
  const emojiRef = useClickOutside(setOpenEmoji);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg || !msg.trim() || !user || !selectedChat) return;
    setMsg("");
    setOpenEmoji(false);
    await sendMessage(msg, selectedChat.id, user);
  }

  function handleEmoji(emojieData) {
    setMsg((msg) => msg + emojieData.emoji);
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
          aria-label="Emoji"
          onClick={() => {
            setOpenEmoji(!openEmoji);
          }}
          type="button"
        >
          🙂
        </button>
        <div
          ref={emojiRef}
          className={styles.emojiWrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} width={"280px"}/>
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
