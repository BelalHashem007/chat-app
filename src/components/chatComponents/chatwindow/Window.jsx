import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";



function Window({messages}) {
  //get current user messages

  const currentUser = {
    userid: 2,
    userMessages: [
      "hi",
      "When will i able to get the details for the course ?",
    ],
  };

  return (
    <div className={styles.windowbg}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <MessageInput />
    </div>
  );
}

export default Window;
