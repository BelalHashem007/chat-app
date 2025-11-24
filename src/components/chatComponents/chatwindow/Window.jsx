import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import styles from "./window.module.css";

const messages = [
  { id: 1, text: "Oldest message" , user:1,date:"11:37 AM"},
  { id: 2, text: "Middle message" , user:1,date:"2:05 PM"},
  { id: 3, text: "newest message" , user:2,date:"5:24 PM"},
  { id: 4, text: "muahaha message" , user:2,date:"10:02 PM"},
  { id: 5, text: "1sdasde" , user:1,date:"7:33 AM"},
  { id: 6, text: "Oxxxxxxxxx" , user:1,date:"4:44 AM"}
];

function Window() {
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
