import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useAuth } from "../../features/auth/AuthContext";
import Card from "../../components/ui/Card";
import { updatePassword } from "../../services/settingsService";
import { getStoredPassword } from "../../services/authService";

const ChangePassword = () => {
  const { loginPassword, updateLoginPassword } = useAuth();
  const toast = useRef<Toast>(null);

  const resolvedPassword = loginPassword ?? getStoredPassword() ?? "";

  const [currentPassword, setCurrentPassword] = useState(resolvedPassword);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const password = loginPassword ?? getStoredPassword() ?? "";
    if (password) {
      setCurrentPassword(password);
    }
  }, [loginPassword]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const validationErrors: Record<string, string> = {};

    if (!currentPassword.trim()) {
      validationErrors.currentPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      validationErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = "New password must be at least 6 characters";
    } else if (newPassword === currentPassword) {
      validationErrors.newPassword =
        "New password must be different from current password";
    }

    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validate()) {
      return;
    }

    try {
      setPasswordLoading(true);
      await updatePassword({ currentPassword, newPassword });
      updateLoginPassword(newPassword);
      setCurrentPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully.",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to change password.";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Card title="Change Password">
        <div className="settings-form">
          <div className="settings-field">
            <label>Current Password</label>
            <InputText
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                clearFieldError("currentPassword");
              }}
              className={`w-full ${errors.currentPassword ? "p-invalid" : ""}`}
              placeholder="Your current password"
            />
            {errors.currentPassword && (
              <small className="field-error">{errors.currentPassword}</small>
            )}
            {!currentPassword && (
              <small className="field-hint">
                Log out and log in again to auto-fill your current password.
              </small>
            )}
          </div>

          <div className="settings-field">
            <label>New Password</label>
            <Password
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearFieldError("newPassword");
              }}
              toggleMask
              feedback
              inputClassName={`w-full ${errors.newPassword ? "p-invalid" : ""}`}
            />
            {errors.newPassword && (
              <small className="field-error">{errors.newPassword}</small>
            )}
          </div>

          <div className="settings-field">
            <label>Confirm New Password</label>
            <Password
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              toggleMask
              feedback={false}
              inputClassName={`w-full ${errors.confirmPassword ? "p-invalid" : ""}`}
            />
            {errors.confirmPassword && (
              <small className="field-error">{errors.confirmPassword}</small>
            )}
          </div>

          <div className="settings-actions">
            <Button
              label="Change Password"
              icon="pi pi-lock"
              loading={passwordLoading}
              onClick={handlePasswordChange}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default ChangePassword;
