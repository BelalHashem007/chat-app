import ContactOptions from "./ContactOptions";
import SearchContacts from "./SearchContacts";
import styles from "./optionsSearchWrapper.module.css";

function OptionsSearchWrapper({chats,setActiveChats,setShowAddContact,setShowAddGroup}) {
  return (
    <div className={styles.optionsSearchWrapper}>
      <ContactOptions  setShowAddContact={setShowAddContact} setShowAddGroup={setShowAddGroup}/>
      <SearchContacts chats={chats} setActiveChats={setActiveChats}/>
    </div>
  );
}

export default OptionsSearchWrapper;
