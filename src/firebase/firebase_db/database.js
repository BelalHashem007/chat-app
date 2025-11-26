import app from "../firebase";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);

async function storeNewUserProfile(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userDataToStore = {
    uid: user.uid,
    email: user.email,
    email_lower: user.email.toLowerCase(),
    displayName: user.displayName || "New User",
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(userRef, userDataToStore);
    console.log("Stored user data successfully.");
  } catch (error) {
    console.log(error);
  }
}

async function searchUsers(searchTerm) {
  const results = { data: [], error: null };
  if (!searchTerm || searchTerm.trim() == "") return results;

  console.log("I ran (SearchUsers)")
  const lowerCasedSearchTerm = searchTerm.toLowerCase();
  const usersRef = collection(db, "users");

  const endSearchTerm = lowerCasedSearchTerm + "\uf8ff";

  const qEmail = query(
    usersRef,
    where("email_lower", ">=", lowerCasedSearchTerm),
    where("email_lower", "<=", endSearchTerm)
  );

  try {
    const querySnapshot = await getDocs(qEmail);

    querySnapshot.forEach((doc) => {
      results.data.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.log(error);
    results.error = "Something went wrong. Please try again.";
  }
  return results;
}

export { storeNewUserProfile, searchUsers };
