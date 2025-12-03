import app from "../firebase";
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
    const [emailQuerySnapshot,guestIdQuerySnapshot] = await Promise.all([getDocs(qEmail),getDocs(qGuestId)]);

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
  if (!currentUser || !participants) return;

  const chatCollectionRef = collection(db, "chats");
  const newChatDocRef = doc(chatCollectionRef);
  const participantsUids = participants.map((participant) => participant.uid);

  const chatToStore = {
    participantsUids: [...participantsUids],
    isGroupChat: isGroupChat,
    createdAt: serverTimestamp(),
    lastMessage: "",
    lastMessageDate: null,
    lastMessageSenderUid: "",
    lastMessageSenderDisplayName: "",
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
        //if this is DM and not groupchat create the contacts
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
  } catch (error) {
    console.log(error);
  }
  return;
}

function subscribeToUserChats(currentUserUid, callback) {
  if (!currentUserUid) return () => {};

  const chatsCollectionRef = collection(db, "chats");
  const q = query(
    chatsCollectionRef,
    where("participantsUids", "array-contains", currentUserUid),
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
        chat.participantsUids.forEach((uid) => {
          if (uid !== currentUserUid) {
            allUids.add(uid);
          }
        });
      });
      const participantDetails = await getParticipantDetails(allUids);
      const enrichedChats = userChats.map((chat) => {
        const enrichedParticipants = chat.participantsUids.map((uid) => {
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

async function sendMessage(msg, chatid, curUser) {
  if (!msg || !msg.trim() || !chatid || !curUser) return;
  try {
    await runTransaction(db, async (transaction) => {
      const newMessageRef = doc(collection(db, `/chats/${chatid}/messages`));

      const msgToStore = {
        senderUid: curUser.uid,
        senderDisplayName: curUser.displayName,
        senderPhotoURL: curUser.photoURL,
        text: msg,
        timestamp: serverTimestamp(),
      };

      //add message doc
      transaction.set(newMessageRef, msgToStore);

      //update chat details
      transaction.update(doc(db, `/chats/${chatid}`), {
        lastMessage: msg,
        lastMessageDate: serverTimestamp(),
        lastMessageSenderUid: curUser.uid,
        lastMessageSenderDisplayName: curUser.displayName,
      });
    });

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function subscribeToChatMessages(chatid, callback) {
  if (!chatid) return ()=>{};

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

function subscribeToCurrentUser(userUid,callback){
 if (!userUid) return ()=>{};
 
  const userDoc = doc(db,`/users/${userUid}`);

  const unsubscribe = onSnapshot(userDoc,(snapshot)=>{
    const userData = snapshot.data();
    callback(userData);
    console.log("Hello userdata:",userData)
  },(error)=>{
    console.log(error);
  })
  
  return unsubscribe;
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
};
