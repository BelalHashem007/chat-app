import { useEffect, useRef, useState } from "react";
import styles from "./window.module.css";
import Icon from '@mdi/react';
import { mdiSendVariantOutline } from '@mdi/js';

function Window(messages = { userid: 1, userMessages: ["hello"] }) {
  //get current user messages
  const [msg,setMsg] = useState("");
  const textareaRef = useRef(null);
  useEffect(()=>{
    if (textareaRef.current){
        textareaRef.current.style.height="auto"
        textareaRef.current.style.height = textareaRef.current.scrollHeight+20 +"px";
    }
  },[msg])
  const currentUser = {
    userid: 2,
    userMessages: [
      "hi",
      "When will i able to get the details for the course ?",
    ],
  };

  return (
    <div className={styles.windowbg}>
      <div className={`${styles.chatBubble} `}></div>

      <div className={styles.msgInputWrapper}>
        <div className={styles.mirror}>{msg || " "}</div>
        <textarea
          name="message"
          id="message"
          className={styles.msgInput}
          placeholder="Message"
          value={msg}
          onChange={(e)=>{setMsg(e.target.value)}}
          
        ></textarea>
        <button className={styles.sendBtn} title="Send">
          <Icon path={mdiSendVariantOutline} size={"30px"} color={"#2196f3"}/>
        </button>
      </div>
    </div>
  );
}

export default Window;
