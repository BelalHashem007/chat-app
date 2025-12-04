import { Navigate} from "react-router";
import { useAuthContext } from "./context/authContext";

function UnAuthorizedRoute({ children }) {
    const {loading,isAuthenticated}= useAuthContext();

  if (loading) {
    return <></>;
  }

  if (!isAuthenticated) { // user signed out
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
}

export default UnAuthorizedRoute;
