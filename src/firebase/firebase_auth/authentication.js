import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase";

const authErrorMessages = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/email-already-in-use": "Email is already in use. Try another one.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email":
    "Please enter a valid email address (e.g., example@domain.com).",
  "auth/network-request-failed":
    "A network error occurred. Please check your internet connection and try again.",
  "auth/internal-error":
    "An unexpected error occurred during registration. Please try again.",
};

const auth = getAuth(app);

async function createUser(email, password) {
  const result = { user: null, error: null };
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(result.user);
    result.user = userCred.user;
  } catch (error) {
    console.log(error);
    result.error =
      authErrorMessages[error.code] ||
      "Something went wrong. Please try again.";
  }
  return result;
}

async function signIn(email, password) {
  const result = { user: null, error: null };
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    result.user = userCred.user;
  } catch (error) {
    result.error =
      authErrorMessages[error.code] ||
      "Something went wrong. Please try again.";
  }
  return result;
}

async function LogOut() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUser(newName) {
  if (!newName || !newName.trim() || auth.currentUser.displayName == newName)
    return;

  try {
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });
    console.log("DisplayName updated!");
  } catch (error) {
    console.log(error);
  }
}

export { createUser, signIn, auth, LogOut,updateUser };
