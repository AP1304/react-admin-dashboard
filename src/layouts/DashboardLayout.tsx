import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import "./DashboardLayout.css";

const settingsSubItems = [
  { label: "Profile Information", to: "/settings/profile" },
  { label: "Change Password", to: "/settings/change-password" },
  { label: "Create User", to: "/settings/create-user" },
];

const DashboardLayout = () => {
  const { logout, user, isAdmin } = useAuth();
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">My SaaS</div>
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>

          {isAdmin && <NavLink to="/employees">Employees</NavLink>}

          <NavLink to="/analytics">Analytics</NavLink>

          {isAdmin && (
            <div className="sidebar-nav-group">
              <NavLink
                to="/settings/profile"
                className={isSettingsActive ? "active" : undefined}
                end={false}
              >
                Settings
              </NavLink>

              <div className="sidebar-subnav">
                {settingsSubItems.map((item) => (
                  <NavLink key={item.to} to={item.to}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <span className="welcome-text">
              Welcome, {user?.name || user?.email}
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
