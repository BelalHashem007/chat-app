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
    // We are connected. If a user is active, ensure their onDisconnect is set
    // and then explicitly mark them online.
    if (currentUid && currentStatusRef) {
      console.log(`Connected. Setting presence for ${currentUid}`);
      // Cancel any previous onDisconnect and set a new one for current user
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

// Global listener for .info/connected, established once when the module loads
// This listener will react to connection changes and then call the handler for the *currently tracked user*.
if (!connectedStateListenerUnsubscribe) { // Ensure listener is only set up once
    connectedStateListenerUnsubscribe = onValue(ref(rtdb, ".info/connected"), (snapshot) => {
        handleConnectionStatusChange(snapshot.val() === true);
    });
}

async function setupCurrentUserPresence(user) {
  //cleanup previous user instance
  if (currentUid && currentUid !== (user ? user.uid : null)) {
    if (currentStatusRef) {
      //make up the last user offline
      set(currentStatusRef, getOfflineState());
    }
    //cancel the ondisconnect instance
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


    // if user is connected go update his presence state
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
