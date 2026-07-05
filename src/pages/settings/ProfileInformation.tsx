import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAuth } from "../../features/auth/AuthContext";
import Card from "../../components/ui/Card";
import { getSettings, updateSettings } from "../../services/settingsService";

const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const ProfileInformation = () => {
  const { refreshUser } = useAuth();
  const toast = useRef<Toast>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setName(data.name || "");
        setEmail(data.email || "");
        setTheme(data.theme || "light");
      } catch (error) {
        console.error("Settings load error:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load settings.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleProfileSave = async () => {
    try {
      setProfileLoading(true);
      await updateSettings({ name, email, theme });
      await refreshUser();
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Profile updated successfully.",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update profile.",
        life: 3000,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <>
      <Toast ref={toast} />

      <Card title="Profile Information">
        <div className="settings-form">
          <div className="settings-field">
            <label>Full Name</label>
            <InputText value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="settings-field">
            <label>Email</label>
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="settings-field">
            <label>Theme</label>
            <Dropdown
              value={theme}
              options={themeOptions}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => setTheme(e.value)}
            />
          </div>

          <div className="settings-actions">
            <Button
              label="Save Profile"
              icon="pi pi-check"
              loading={profileLoading}
              onClick={handleProfileSave}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProfileInformation;
