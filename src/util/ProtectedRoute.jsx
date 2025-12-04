import { Navigate} from "react-router";
import { useAuthContext } from "./context/authContext";


function ProtectedRoute({ children }) {
    const {loading,isAuthenticated}= useAuthContext();

  if (loading) {
    return <div></div>;
  }

  if (isAuthenticated) {//user logged in 
    return <>{children}</>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
