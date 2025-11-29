import { Outlet } from "react-router";
import AuthProvider from "./util/AuthProvider";

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default Root;
