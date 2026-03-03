import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/AuthContext";
import Card from "../components/ui/Card";
import "./Dashboard.css";

const Settings = () => {
  const { isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (!isAdmin) {
    return (
      <div className="dashboard-container">
        <h1>Access Restricted</h1>
        <Card>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "16px",
              color: "var(--danger)",
              fontWeight: 500,
            }}
          >
            You do not have permission to access Settings.
          </div>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    localStorage.setItem("darkMode", String(darkMode));
  };

  return (
    <div className="dashboard-container">
      <h1>Settings</h1>

      <Card title="Profile Settings">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </Card>

      <Card title="Preferences">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            color: "var(--text-primary)",
          }}
        >
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Enable Dark Mode
        </label>
      </Card>

      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Save Settings
      </button>
    </div>
  );
};

export default Settings;