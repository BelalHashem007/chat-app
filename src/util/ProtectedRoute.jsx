import { Navigate, useOutletContext } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase_auth/authentication";
import { setupCurrentUserPresence } from "../firebase/firebase_RTdb/rtdb";

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStatus();

  if (isAuthenticated === null) {
    return <div>loading authentication...</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }
}

function useAuthStatus() {
  const [, setUser] = useOutletContext();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setupCurrentUserPresence(user);

      setUser(user);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [setIsAuthenticated, setUser]);

  return isAuthenticated;
}

export default ProtectedRoute;
