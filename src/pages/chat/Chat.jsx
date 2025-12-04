import styles from "./chat.module.css";
import ContactList from "./ContactList";
import WindowPage from "./WindowPage";
import { useEffect, useState } from "react";
import Sidebar from "../../components/chatComponents/sidebar/Sidebar";
import Profile from "../../components/chatComponents/profile/Profile";
import { useAuthContext } from "../../util/context/authContext";
import {
  subscribeToUserChats,
  subscribeToCurrentUser,
} from "../../firebase/firebase_db/database";

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
  profile: ({ userData }) => <Profile userData={userData} />,
};

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeComponent, setActiveComponent] = useState("contactList");
  const [chats, setChats] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({});

  console.log(user);
  const DynamicComponent = dynamicComponents[activeComponent];

  //subscribe to chats
  useEffect(() => {
    const unsubscribe = subscribeToUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
      setActiveChats(fetchedChats);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  //subscribe to user details
  useEffect(() => {
    if (!user.uid) return;
    const unsubscribe = subscribeToCurrentUser(user.uid, (fetchedData) => {
      setUserData(fetchedData);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  return (
    <div className={styles.chatWrapper}>
      <div className={`${styles.sidebar} ${selectedChat && styles.hide}`}>
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>
      <DynamicComponent
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        activeChats={activeChats}
        setActiveChats={setActiveChats}
        setActiveComponent={setActiveComponent}
        userData={userData}
      />
      <WindowPage selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
    </div>
  );
}

export default Chat;
