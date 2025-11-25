import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Chat from "../pages/chat/Chat";
import { Navigate } from "react-router";
import ErrorNotFound from "../pages/error/ErrorNotFound";
import OtherErrors from "../pages/error/OtherErrors";
import Root from "../Root";
import ProtectedRoute from "../util/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <OtherErrors />,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" />,
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            {" "}
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      { path: "*", element: <ErrorNotFound /> },
    ],
  },
];

export default routes;
