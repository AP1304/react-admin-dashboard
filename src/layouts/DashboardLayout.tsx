import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">My SaaS</div>
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/users">Users</NavLink>
          )}
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <span>Welcome, {user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;