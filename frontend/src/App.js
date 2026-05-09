// This is the main App component for the Attendx React application.
// It defines the routing structure using React Router.
// Routes include landing page, authentication (login/register), 
// dashboard, session creation, token entry, success page, and reports.
// All routes are wrapped in Routes from react-router-dom.
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateSession from "./pages/CreateSession";
import TokenPage from "./pages/TokenPage";
import EnterToken from "./pages/EnterToken";
import Success from "./pages/Success";
import Reports from "./pages/Reports";
import StudentDashboard from "./pages/StudentDashboard";
import AttendanceHistory from "./pages/AttendanceHistory";
import CourseRegistration from "./pages/CourseRegistration";
import MyCourses from "./pages/MyCourses";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);

      const token = localStorage.getItem("token");
      if (!token) return;

      timeoutId = setTimeout(() => {
        localStorage.clear();
        toast.error("Session expired due to 10 minutes of inactivity.");
        navigate("/login");
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    
    resetTimeout();
    events.forEach(event => window.addEventListener(event, resetTimeout));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [navigate, location.pathname]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/history" element={<AttendanceHistory />} />
        <Route path="/course-registration" element={<CourseRegistration />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="/token" element={<TokenPage />} />
        <Route path="/enter-token" element={<EnterToken />} />
        <Route path="/success" element={<Success />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
