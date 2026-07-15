import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <Login onLogin={(userData) => setCurrentUser(userData)} />;
  }

  return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
}