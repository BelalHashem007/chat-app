import app from "../firebase";
import { otherAdminsExist } from "../../util/utilFunctions";
import { updateUser } from "../firebase_auth/authentication";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  updateDoc,
  runTransaction,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { auth } from "../firebase_auth/authentication";
import { nanoid } from "nanoid";

const db = getFirestore(app);

async function storeNewUserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userDataToStore = {
    uid: user.uid,
    email: user.email,
    email_lower: user.email?.toLowerCase() || null,
    displayName: user.displayName || "New User",
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isAnonymous: user.isAnonymous,
  };

  if (userDataToStore.isAnonymous) {
    userDataToStore.guestId = nanoid(8);
    userDataToStore.guestId_lower = userDataToStore.guestId?.toLowerCase();
  }

  try {
    await setDoc(userRef, userDataToStore);
    console.log("Stored user data successfully.");
  } catch (error) {
    console.log(error);
  }
}

async function searchUsers(searchTerm, curUserUid) {
  const results = { data: [], error: null };
  if (!searchTerm || searchTerm.trim() == "") return results;

  const usersRef = collection(db, "users");

  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  const endSearchTerm = lowerCasedSearchTerm + "\uf8ff";

  //Search for users whose email OR guestid starts with the searchterm
  const qEmail = query(
    usersRef,
    where("email_lower", ">=", lowerCasedSearchTerm),
    where("email_lower", "<=", endSearchTerm)
  );

  const qGuestId = query(
    usersRef,
    where("guestId_lower", ">=", lowerCasedSearchTerm),
    where("guestId_lower", "<=", endSearchTerm)
  );
  try {
    //fetch all docs at the same
    const [emailQuerySnapshot, guestIdQuerySnapshot] = await Promise.all([
      getDocs(qEmail),
      getDocs(qGuestId),
    ]);

    const contacts = await getDocs(
      collection(db, `/users/${curUserUid}/contacts`)
    );
    const contactsUids = new Set(contacts.docs.map((doc) => doc.id));

    //push data for emails match
    emailQuerySnapshot.forEach((doc) => {
      const data = { ...doc.data() };
      const userUid = data.uid || doc.id;

      if (curUserUid == userUid) return; //exclude current user
      if (contactsUids.has(userUid)) return; // exclude current contacts
      results.data.push({ id: doc.id, ...doc.data() });
    });

    //push data for guestids match
    guestIdQuerySnapshot.forEach((doc) => {
      const data = { ...doc.data() };
      const userUid = data.uid || doc.id;

      if (curUserUid == userUid) return; //exclude current user
      if (contactsUids.has(userUid)) return; // exclude current contacts
      results.data.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.log(error);
    results.error = "Something went wrong. Please try again.";
  }
  return results;
}

async function createNewChatRoom(
  currentUser,
  participants,
  isGroupChat,
  groupName,
  adminUids
) {
  const result = { isChatCreated: false, error: null };

  if (!currentUser || !participants) {
    result.error = "Missing data.";
    return result;
  }

  const chatCollectionRef = collection(db, "chats");
  const newChatDocRef = doc(chatCollectionRef);
  const participantsUids = participants.map((participant) => participant.uid);

  const chatToStore = {
    allTimeParticipantsUids: [...participantsUids],
    isGroupChat: isGroupChat,
    createdAt: serverTimestamp(),
    lastMessage: "",
    lastMessageDate: null,
    lastMessageSenderUid: "",
    lastMessageSenderDisplayName: "",
    activeParticipantsUids: [...participantsUids],
  };

  if (isGroupChat) {
    //group chat stuff
    chatToStore.groupName = groupName;
    chatToStore.adminUids = adminUids || [currentUser.uid];
    chatToStore.groupProfileURL = null;
  } else {
    if (participants.length !== 2)
      return console.log("DMs must be between two people.");
  }
  console.log(participants, chatToStore);
  try {
    await runTransaction(db, async (transaction) => {
      //create chatroom
      transaction.set(newChatDocRef, chatToStore);

      if (!isGroupChat) {
        //create contact for curuser
        transaction.set(
          doc(db, `/users/${currentUser.uid}/contacts/${participants[0].uid}`),
          {
            createdAt: serverTimestamp(),
          }
        );
        //create contact for otheruser
        transaction.set(
          doc(db, `/users/${participants[0].uid}/contacts/${currentUser.uid}`),
          {
            createdAt: serverTimestamp(),
          }
        );
      }
    });

    result.isChatCreated = true;
  } catch (error) {
    console.error(error);
    result.error = error;
  }
  console.log(result);
  return result;
}

function subscribeToUserChats(currentUserUid, callback) {
  if (!currentUserUid) return () => {};

  const chatsCollectionRef = collection(db, "chats");
  const q = query(
    chatsCollectionRef,
    where("activeParticipantsUids", "array-contains", currentUserUid),
    orderBy("lastMessageDate", "desc")
  );
  const unsubscribe = onSnapshot(
    q,
    async (querySnapshot) => {
      const userChats = [];
      querySnapshot.forEach((doc) => {
        userChats.push({
          id: doc.id,
          ...doc.data({ serverTimestamps: "estimate" }),
        });
      });

      const allUids = new Set();
      userChats.forEach((chat) => {
        chat.allTimeParticipantsUids.forEach((uid) => {
          if (uid !== currentUserUid) {
            allUids.add(uid);
          }
        });
      });
      const participantDetails = await getParticipantDetails(allUids);
      const enrichedChats = userChats.map((chat) => {
        const enrichedParticipants = chat.allTimeParticipantsUids.map((uid) => {
          return (
            participantDetails.get(uid) || {
              uid: uid,
              displayName: "Unknown User",
            }
          );
        });
        return { ...chat, enrichedParticipants };
      });

      callback(enrichedChats); // Pass the updated list of chats to your component
    },
    (error) => {
      console.error("Error fetching user chats:", error);
    }
  );

  return unsubscribe;
}

async function sendMessage(
  msg,
  chatid,
  curUser,
  isSystem,
  existingTransaction
) {
  if (!msg || !msg.trim() || !chatid || !curUser) return;

  const performOperations = async (transaction) => {
    const newMessageRef = doc(collection(db, `/chats/${chatid}/messages`));

    const msgToStore = {
      senderUid: curUser.uid,
      senderDisplayName: curUser.displayName,
      senderPhotoURL: curUser.photoURL,
      text: msg,
      timestamp: serverTimestamp(),
      chatId: chatid,
    };

    if (isSystem) {
      msgToStore.isSystem = isSystem;
      msgToStore.senderUid = "system";
      msgToStore.senderDisplayName = "System";
      msgToStore.senderPhotoURL = null;
    }

    //add message doc
    transaction.set(newMessageRef, msgToStore);

    //update chat details
    transaction.update(doc(db, `/chats/${chatid}`), {
      lastMessage: msg,
      lastMessageDate: serverTimestamp(),
      lastMessageSenderUid: curUser.uid,
      lastMessageSenderDisplayName: curUser.displayName,
    });
  };

  try {
    if (existingTransaction) {
      await performOperations(existingTransaction);
    } else {
      await runTransaction(db, performOperations);
    }
    console.log("Message operations completed successfully.");
  } catch (error) {
    console.error("Error in message operations:", error);
  }
}

function subscribeToChatMessages(chatid, callback) {
  if (!chatid) return () => {};

  const messagesCollectionRef = collection(db, `/chats/${chatid}/messages`);

  const q = query(
    messagesCollectionRef,
    orderBy("timestamp", "asc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data({ serverTimestamps: "estimate" }),
        });
      });

      callback(messages);
    },
    (error) => {
      console.log(error);
    }
  );

  return unsubscribe;
}

async function getParticipantDetails(participantUids) {
  if (participantUids.size == 0) return;
  const chunks = [];
  const participantUidsArray = Array.from(participantUids);
  for (let i = 0; i < participantUidsArray.length; i += 10) {
    chunks.push(participantUidsArray.slice(i, i + 10));
  }
  const allParticipantsDocs = [];

  for (const chunk of chunks) {
    const q = query(collection(db, "users"), where("uid", "in", chunk));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allParticipantsDocs.push({
        ...doc.data({ serverTimestamps: "estimate" }),
      });
    });
  }

  const allParticipantsDetails = new Map();

  allParticipantsDocs.forEach((user) => {
    allParticipantsDetails.set(user.uid, user);
  });

  return allParticipantsDetails;
}

async function updateUserName(userUid, newName) {
  if (!userUid || !newName || !newName.trim()) return;
  if (auth.currentUser?.uid !== userUid) {
    console.error("Attempt to update profile for a different user.");
    return;
  }

  try {
    //update authentication details
    await updateUser(newName);

    //update cloud firestore
    await updateDoc(doc(db, `/users/${userUid}`), {
      displayName: newName,
      updatedAt: serverTimestamp(),
    });
    console.log("Updated user displayname in cloud firestore.");
  } catch (error) {
    console.error(error);
  }
}

function subscribeToCurrentUser(userUid, callback) {
  if (!userUid) return () => {};

  const userDoc = doc(db, `/users/${userUid}`);

  const unsubscribe = onSnapshot(
    userDoc,
    (snapshot) => {
      const userData = snapshot.data();
      callback(userData);
      console.log("Hello userdata:", userData);
    },
    (error) => {
      console.log(error);
    }
  );

  return unsubscribe;
}

async function removeContact(chatId, curUserUid, contactUid) {
  if (!chatId || !curUserUid || !contactUid) return console.log("Missing data");

  const result = { isRemoved: false, error: null };

  try {
    await runTransaction(db, async (transaction) => {
      //delete chat
      transaction.delete(doc(db, `/chats/${chatId}`));

      //delete contact for curUser
      transaction.delete(
        doc(db, `/users/${curUserUid}/contacts/${contactUid}`)
      );

      //delete curUser for contact
      transaction.delete(
        doc(db, `/users/${contactUid}/contacts/${curUserUid}`)
      );
    });

    result.isRemoved = true;
  } catch (error) {
    console.log(error);
    result.error = error;
  }
  return result;
}

async function leaveGroup(chat, userUid) {
  const result = { didLeave: false, error: null };
  if (!chat || !userUid) {
    result.error = "Missing data.";
    return result;
  }

  try {
    const userSnapShot = await getDoc(doc(db, `/users/${userUid}`));
    if (!userSnapShot.exists()) {
      result.error = "User doesn`t exist.";
      return result;
    }

    const adminsExist = otherAdminsExist(chat, userUid);
    let newAdmin = null;

    let objectToUpdateChat = { activeParticipantsUids: arrayRemove(userUid) };
    console.log(objectToUpdateChat);
    if (!adminsExist) {
      const newArrayWithoutCurrentUser = chat.activeParticipantsUids.filter(
        (uid) => userUid != uid
      );
      const randomIndex = Math.floor(
        Math.random() * chat.activeParticipantsUids.length
      );
      newAdmin = newArrayWithoutCurrentUser[randomIndex];
      objectToUpdateChat.adminUids = [newAdmin];
    }

    console.log(objectToUpdateChat);

    const user = { ...userSnapShot.data() };

    await runTransaction(db, async (transaction) => {
      const newChatSnapShot = await transaction.get(
        doc(db, `/chats/${chat.id}`)
      );
      if (!newChatSnapShot.exists()) throw Error("Chat doesn`t exist.");
      const newChat = { ...newChatSnapShot.data() };

      if (newChat.activeParticipantsUids.length == 1) {
        throw Error("You can`t leave when you are the only one in the group.")
      }

      transaction.update(doc(db, `/chats/${chat.id}`), objectToUpdateChat);

      sendMessage(
        `${user.displayName} Has left the group.`,
        chat.id,
        user,
        true,
        transaction
      );
    });

    result.didLeave = true;
  } catch (error) {
    console.error(error);
    result.error = error;
  }

  return result;
}

async function deleteGroup(chat,userUid){

  const result = {isDeleted:false,error:null};

  if (!chat || !userUid) {
    result.error="Missing data";
    return result;
  }

  try {
    await runTransaction(db,async (transaction)=>{
      const chatSnapshot = await transaction.get(doc(db,`/chats/${chat.id}`));
      if (!chatSnapshot.exists()) {
        throw Error("Chat doesn`t exist.")
      }

      const chatData = {...chatSnapshot.data()};

      if (!chatData.adminUids.includes(userUid)){
        throw Error("You are not an admin in this group.")
      }

      //delete chat
      transaction.delete(doc(db,`/chats/${chat.id}`));
        
    })

    result.isDeleted = true;
    
  } catch (error) {
    result.error=error;
    console.error(error);
  }

  return result;

}

export {
  storeNewUserProfile,
  searchUsers,
  createNewChatRoom,
  subscribeToUserChats,
  sendMessage,
  subscribeToChatMessages,
  updateUserName,
  subscribeToCurrentUser,
  removeContact,
  leaveGroup,
  deleteGroup,
};
