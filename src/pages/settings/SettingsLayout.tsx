import { Outlet } from "react-router-dom";
import "../Dashboard.css";

const SettingsLayout = () => {
  return (
    <div className="dashboard-container">
      <h1>Settings</h1>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
