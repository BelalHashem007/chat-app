import ContactOptions from "./ContactOptions";
import SearchContacts from "./SearchContacts";
import styles from "./optionsSearchWrapper.module.css";

function OptionsSearchWrapper({chats,setActiveChats,setActiveComponent}) {
  return (
    <div className={styles.optionsSearchWrapper}>
      <ContactOptions setActiveComponent={setActiveComponent}/>
      <SearchContacts chats={chats} setActiveChats={setActiveChats}/>
    </div>
  );
}

export default OptionsSearchWrapper;
