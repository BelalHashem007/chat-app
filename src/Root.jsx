import { Outlet } from "react-router";
import AuthProvider from "./util/AuthProvider";
import ToastProvider from "./components/chatComponents/toast/ToastProvider";

function Root() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ToastProvider>
  );
}

export default Root;
