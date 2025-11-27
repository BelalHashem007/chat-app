import app from "../firebase";
import { getDatabase, onDisconnect, onValue, ref,serverTimestamp,set } from "firebase/database";

const rtdb = getDatabase(app);

async function setupCurrentUserPresence(user) {
  if (!user) {
    console.log("No user logged in, cannot set up presence.");
    return;
  }
  const userStatusDatabaseRef = ref(rtdb, `/presence/${user.uid}`);

  const isOfflineForDatabase = {
    state: "offline",
    last_changed: serverTimestamp(),
  };

  const isOnlineForDatabase = {
    state: "online",
    last_changed: serverTimestamp(),
  };

  onValue(ref(rtdb,".info/connected"),async(snapshot)=>{
    if (snapshot.val() == false){
        return;
    }

    await onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase);

    await set(userStatusDatabaseRef, isOnlineForDatabase);
    console.log(`User ${user.uid} is now ONLINE in Realtime Database.`);
  })
}

function listenToUserOnlineStatus(otherUserUid,callback){
    const otherUserStatusRef = ref(rtdb, `/presence/${otherUserUid}`);

    return onValue(otherUserStatusRef, (snapshot) => {
    const statusData = snapshot.val();
    if (statusData) {
      callback({
        state: statusData.state,
        last_changed: statusData.last_changed,
      });
    } else {
      // If no data exists, assume offline (or a user without presence set up)
      callback(null);
    }
  });
}


export {listenToUserOnlineStatus,setupCurrentUserPresence}