import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";

function Window({ messages }) {
  //get current user messages

  const currentUser = {
    userid: 2,
    userMessages: [
      "hi",
      "When will i able to get the details for the course ?",
    ],
  };
  if (!messages) {
    return (
      <div className={`${styles.windowbg} ${styles.notActive}`}>
        <div className={styles.notActiveWrapper}>
          <div>You haven`t started a chat yet!</div>
          <div>Click on a contact to start chatting.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.windowbg} ${styles.active}`}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <MessageInput />
    </div>
  );
}

export default Window;
