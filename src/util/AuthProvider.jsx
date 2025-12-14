import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { setupCurrentUserPresence } from "../firebase/firebase_RTdb/rtdb";
import { auth } from "../firebase/firebase_auth/authentication";
import { AuthContext } from "./context/authContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setupCurrentUserPresence(user);
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  });

  return (
    <AuthContext value={{ user, loading, isAuthenticated }}>
      {children}
    </AuthContext>
  );
}

