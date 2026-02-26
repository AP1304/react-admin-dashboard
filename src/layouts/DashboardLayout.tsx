import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const confirmLogout = () => {
    confirmDialog({
      message: "Are you sure you want to logout?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",

      accept: () => {
        logout();
        navigate("/");
      },

      reject: () => {
        // Do nothing, stay on page
      },
    });
  };

  return (
    <div className="dashboard-container">
      {/* Required for ConfirmDialog */}
      <ConfirmDialog />

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h2 className="logo">AdminPanel</h2>}
          <FiMenu
            className="menu-toggle"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <nav>
          <NavLink to="/dashboard">
            <FiHome />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/users">
            <FiUsers />
            {!collapsed && <span>Users</span>}
          </NavLink>

          <NavLink to="/analytics">
            <FiBarChart2 />
            {!collapsed && <span>Analytics</span>}
          </NavLink>

          <NavLink to="/settings">
            <FiSettings />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span>Welcome, {user}</span>
          <button onClick={confirmLogout}>Logout</button>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;