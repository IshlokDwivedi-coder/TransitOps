import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={setUser} />} />
      </Routes>
    );
  }
  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand">🚚
 TransitOps</span>
        <div className="navbar-nav me-auto d-flex flex-row gap-3">
          <Link className="nav-link" to="/">Dashboard</Link>
          <Link className="nav-link" to="/vehicles">Vehicles</Link>
          <Link className="nav-link" to="/drivers">Drivers</Link>
          <Link className="nav-link" to="/trips">Trips</Link>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout ({user.name})
        </button>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
);
}