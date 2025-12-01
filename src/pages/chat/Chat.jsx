import styles from "./chat.module.css";
import ContactList from "./ContactList";
import WindowPage from "./WindowPage";
import { useEffect, useState } from "react";
import Sidebar from "../../components/chatComponents/sidebar/Sidebar";
import Profile from "../../components/chatComponents/profile/Profile";
import { useAuthContext } from "../../util/context";
import { subscribeToUserChats } from "../../firebase/firebase_db/database";

const dynamicComponents = {
  contactList: ({
    selectedChat,
    setSelectedChat,
    chats,
    activeChats,
    setActiveChats,
  }) => (
    <ContactList
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      chats={chats}
      activeChats={activeChats}
      setActiveChats={setActiveChats}
    />
  ),
  profile: () => <Profile />,
};

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeComponent, setActiveComponent] = useState("contactList");
  const [chats, setChats] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const { user } = useAuthContext();

  const DynamicComponent = dynamicComponents[activeComponent];

  useEffect(() => {
    const unsubscribe = subscribeToUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
      setActiveChats(fetchedChats);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className={styles.chatWrapper}>
      <Sidebar setActiveComponent={setActiveComponent} />
      <DynamicComponent
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        activeChats={activeChats}
        setActiveChats={setActiveChats}
        setActiveComponent={setActiveComponent}
      />
      <WindowPage selectedChat={selectedChat} />
    </div>
  );
}

export default Chat;
