import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "./@types";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import { PrivateRoute } from "./utils/PrivateRoute";
import Dashboard from "./pages/admin/Dashboard";

const Root = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/user/dashboard" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  // Admin Routes
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
  // User Routes
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["member"]} />,
    children: [
      {
        path: "dashboard",
        element: "Dashboard Page for User",
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;
