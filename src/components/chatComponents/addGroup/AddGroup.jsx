import styles from "./addGroup.module.css";
import { useMemo, useState } from "react";
import { useAuthContext } from "../../../util/context/authContext";
import DefaultImage from "../../../util/DefaultImage";
import OtherGroupOptions from "./OtherGroupOptions";

function AddGroup({ showAddGroup, setShowAddGroup, chats }) {
  const { user } = useAuthContext();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  //calculating ALL contacts the user have
  const baseContacts = useMemo(() => {
    if (chats.length == 0) return [];
    const contactsChatsOnly = chats.filter((chat) => !chat.isGroupChat);
    const contactsDetails = contactsChatsOnly.flatMap((contactChat) => {
      const contactOnly = contactChat.enrichedParticipants.filter(
        (participant) => {
          return participant.uid != user.uid;
        }
      );
      return contactOnly;
    });
    return contactsDetails;
  }, [chats, user.uid]);

  // make set to search faster and only save the uid not the whole object
  const selectedUids = new Set(selectedContacts.map((contact) => contact.uid));

  //exclude selected contacts
  let availableContacts = baseContacts.filter(
    (contact) => !selectedUids.has(contact.uid)
  );

  if (searchTerm) {
    availableContacts = availableContacts.filter((contact) => {
      return contact.displayName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }

  //handlers

  function handleAddingSelected(contact) {
    setSelectedContacts((prev) => [...prev, contact]);
  }

  function handleRemovingSelected(contact) {
    setSelectedContacts((prev) =>
      prev.filter((prevContact) => prevContact.uid !== contact.uid)
    );
  }

  function handleClosingAddGroup() {
    setSelectedContacts([]);
    setShowAddGroup(false);
  }

  function handleNext() {
    setShowOptions(true);
  }

  return (
    <div inert={!showAddGroup} className={`${styles.addGroupWrapper} ${showAddGroup && styles.show}`} data-testid="AddGroupWrapper">
      {showOptions ? (
        <OtherGroupOptions
          setShowOptions={setShowOptions}
          selectedContacts={selectedContacts}
          handleClosingAddGroup={handleClosingAddGroup}
        />
      ) : (
        <>
          <button
            title="close"
            className={styles.backBtn}
            onClick={handleClosingAddGroup}
            aria-label="close"
            data-testid="closeBtn"
          >
            X
          </button>
          <p>Add group members:</p>
          {selectedContacts.length > 0 && (
            <ul
              className={styles.selectedContacts}
              aria-label="Selected contacts"
            >
              {selectedContacts.map((contact) => (
                <li
                  className={styles.selectedWrapper}
                  aria-label={contact.displayName}
                  data-testid="selectedWrapper"
                >
                  <div className={styles.selectedImg} data-testId="selectedImg">
                    <DefaultImage text={contact.email || contact.displayName} />
                  </div>
                  <div className={styles.selectedName} data-testId="selectedName">
                    {contact.displayName}
                  </div>
                  <button
                    className={styles.removeSelected}
                    aria-label="Remove from selected"
                    onClick={() => {
                      handleRemovingSelected(contact);
                    }}
                    data-testId="selectedRemoveBtn"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label htmlFor="SearchContacts" className={styles.srOnly}>
            Search for contacts
          </label>
          <input
            className={styles.searchInp}
            type="text"
            name="SearchContacts"
            id="SearchContacts"
            placeholder="Search name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button
            onClick={handleNext}
            className={styles.nextBtn}
            disabled={selectedContacts.length == 0}
            title={
              selectedContacts.length == 0 &&
              "You must select at least 1 contact"
            }
            aria-label={
              selectedContacts.length == 0
                ? "You must select at least 1 contact"
                : ""
            }
          >
            Next
          </button>

          <ul className={styles.availableContacts}>
            {availableContacts.map((contact) => {
              return (
                <li key={contact.uid} className={styles.addContactToGroup}>
                  <button
                    onClick={() => {
                      handleAddingSelected(contact);
                    }}
                    data-testid="addContactToGroup"
                  >
                    <div className={styles.contactImg} data-testid="contactImg">
                      <DefaultImage text={contact.email || contact.displayName} />
                    </div>
                    <div className={styles.contactName} data-testid="contactName">
                      {contact.displayName}
                      {contact.isAnonymous && <span className={styles.guestId} data-testid="guestId">#{contact.guestId}</span>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default AddGroup;
