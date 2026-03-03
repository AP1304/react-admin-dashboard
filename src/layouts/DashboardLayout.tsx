import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { logout, user, isAdmin } = useAuth();

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">My SaaS</div>
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>

          {isAdmin && <NavLink to="/users">Users</NavLink>}

          <NavLink to="/analytics">Analytics</NavLink>

          {isAdmin && <NavLink to="/settings">Settings</NavLink>}
        </nav>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <span className="welcome-text">
              Welcome, {user?.email}
            </span>

            <span
              className={`role-badge ${
                user?.role === "admin" ? "admin" : "user"
              }`}
            >
              {user?.role?.toUpperCase()}
            </span>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;