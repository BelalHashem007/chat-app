import app from "../firebase";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

const rtdb = getDatabase(app);

//lastuser presence
let currentUid = null;
let currentStatusRef = null;
let currentOnDisconnectInstance = null;
let connectedStateListenerUnsubscribe = null;

const getOfflineState = () => ({
  state: "offline",
  last_changed: serverTimestamp(),
});
const getOnlineState = () => ({
  state: "online",
  last_changed: serverTimestamp(),
});

const handleConnectionStatusChange = (connected) => {
  if (connected) {
    if (currentUid && currentStatusRef) {
      if (currentOnDisconnectInstance) {
        currentOnDisconnectInstance.cancel();
      }
      currentOnDisconnectInstance = onDisconnect(currentStatusRef);
      currentOnDisconnectInstance.set(getOfflineState()); 

      // Mark the user as online *now*
      set(currentStatusRef, getOnlineState());
    }
  }
};


if (!connectedStateListenerUnsubscribe) { 
    connectedStateListenerUnsubscribe = onValue(ref(rtdb, ".info/connected"), (snapshot) => {
        handleConnectionStatusChange(snapshot.val() === true);
    });
}

async function setupCurrentUserPresence(user) {
  //cleanup previous user instance
  if (currentUid && currentUid !== (user ? user.uid : null)) {
    if (currentStatusRef) {
      set(currentStatusRef, getOfflineState());
    }
    if (currentOnDisconnectInstance) {
      currentOnDisconnectInstance.cancel();
    }

    //reset tracking
    currentUid = null;
    currentStatusRef = null;
    currentOnDisconnectInstance = null;
  }
  //setup presence
  if (user) {
    const userStatusDatabaseRef = ref(rtdb, `/presence/${user.uid}`);

    currentUid = user.uid;
    currentStatusRef = userStatusDatabaseRef;


     onValue(ref(rtdb, ".info/connected"), (snapshot) => {
        const connected = snapshot.val() === true;
        handleConnectionStatusChange(connected);
    }, { onlyOnce: true });

  }
}

function listenToUserOnlineStatus(otherUserUid, callback) {
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

export { listenToUserOnlineStatus, setupCurrentUserPresence };
