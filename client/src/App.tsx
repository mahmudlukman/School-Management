import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "./@types";
import Login from "./pages/auth/Login";
import { PrivateRoute } from "./utils/PrivateRoute";
import MainLayout from "./components/Layouts/MainLayout";
import Dashboard from "./pages/admin/Dashboard";

// Import pages
import Students from "./pages/list/students/Students";
import Teachers from "./pages/list/teachers/Teachers";
import Parents from "./pages/list/parents/Parents";
import Classes from "./pages/list/classes/Classes";
import Subjects from "./pages/list/subjects/Subjects";
import Timetable from "./pages/list/timetable/Timetable";
import Attendance from "./pages/list/attendance/Attendance";
import Results from "./pages/list/results/Results";
import Homework from "./pages/list/homework/Homework";
import Fees from "./pages/list/fees/Fees";
import Events from "./pages/list/events/Events";
import Announcements from "./pages/list/announcements/Announcements";
import Exams from "./pages/list/exams/Exams";
import Library from "./pages/list/library/Library";
import Transport from "./pages/list/transport/Transport";
import Hostel from "./pages/list/Hostel/Hostel";
import Messages from "./pages/list/messages/Messages";
import Complaints from "./pages/list/complaints/Complaints";
import Certificates from "./pages/list/certificates/Certificates";
import Leave from "./pages/list/leave/Leave";
import Expenses from "./pages/list/expenses/Expenses";
import Notifications from "./pages/list/notifications/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const Root = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
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

  // All Protected Routes
  {
    path: "/",
    element: (
      <PrivateRoute
        allowedRoles={[
          "super_admin",
          "admin",
          "principal",
          "teacher",
          "student",
          "parent",
          "accountant",
          "librarian",
          "receptionist",
        ]}
      />
    ),
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "students", element: <Students /> },
          { path: "teachers", element: <Teachers /> },
          { path: "parents", element: <Parents /> },
          { path: "classes", element: <Classes /> },
          { path: "subjects", element: <Subjects /> },
          { path: "timetable", element: <Timetable /> },
          { path: "attendance", element: <Attendance /> },
          { path: "exams", element: <Exams /> },
          { path: "results", element: <Results /> },
          { path: "homework", element: <Homework /> },
          { path: "fees", element: <Fees /> },
          { path: "library", element: <Library /> },
          { path: "transport", element: <Transport /> },
          { path: "hostel", element: <Hostel /> },
          { path: "events", element: <Events /> },
          { path: "announcements", element: <Announcements /> },
          { path: "messages", element: <Messages /> },
          { path: "complaints", element: <Complaints /> },
          { path: "certificates", element: <Certificates /> },
          { path: "leave", element: <Leave /> },
          { path: "expenses", element: <Expenses /> },
          { path: "notifications", element: <Notifications /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;
