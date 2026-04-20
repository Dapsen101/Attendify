// This is the main App component for the Attendify React application.
// It defines the routing structure using React Router.
// Routes include landing page, authentication (login/register), 
// dashboard, session creation, token entry, success page, and reports.
// All routes are wrapped in Routes from react-router-dom.
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateSession from "./pages/CreateSession";
import TokenPage from "./pages/TokenPage";
import EnterToken from "./pages/EnterToken";
import Success from "./pages/Success";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/create-session" element={<CreateSession />} />
      <Route path="/token" element={<TokenPage />} />
      <Route path="/enter-token" element={<EnterToken />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;