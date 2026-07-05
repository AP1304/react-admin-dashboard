import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import type {
  ManagedUser,
  UpdateUserPayload,
} from "../../services/userManagementService";
import { getManagedUserPassword } from "../../services/userManagementService";
import "../employee/EmployeeForm.css";
import "./EditUserForm.css";

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

interface EditUserFormProps {
  visible: boolean;
  user: ManagedUser | null;
  onHide: () => void;
  onSave: (id: string, payload: UpdateUserPayload) => Promise<void>;
}

const EditUserForm = ({ visible, user, onHide, onSave }: EditUserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && visible) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setStatus(user.status || "Active");
      setPassword(getManagedUserPassword(user._id));
      setErrors({});
    }
  }, [user, visible]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const validationErrors: Record<string, string> = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      validationErrors.email = "Invalid email address";
    }

    if (password && password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user || !validate()) {
      return;
    }

    try {
      setLoading(true);
      const payload: UpdateUserPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        status,
      };

      if (password.trim()) {
        payload.password = password;
      }

      await onSave(user._id, payload);
      onHide();
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="employee-form-footer">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
        disabled={loading}
      />
      <Button
        label="Update"
        icon="pi pi-check"
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (!loading) onHide();
      }}
      closable={!loading}
      closeOnEscape={!loading}
      dismissableMask={!loading}
      header="Edit User"
      footer={footer}
      modal
      draggable={false}
      resizable={false}
      style={{ width: "700px", maxWidth: "95vw" }}
      className="employee-dialog"
    >
      <div className="employee-form-grid">
        <div className="form-field">
          <label>Name</label>
          <InputText
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            className={errors.name ? "p-invalid" : ""}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
        </div>

        <div className="form-field">
          <label>Email</label>
          <InputText
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            className={errors.email ? "p-invalid" : ""}
          />
          {errors.email && <small className="p-error">{errors.email}</small>}
        </div>

        <div className="form-field">
          <label>Phone</label>
          <InputText
            value={phone}
            maxLength={10}
            keyfilter="int"
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Optional"
          />
        </div>

        <div className="form-field">
          <label>Status</label>
          <Dropdown
            value={status}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Select Status"
            onChange={(e) => setStatus(e.value)}
          />
        </div>

        <div className="form-field form-field-full">
          <label>Password</label>
          <InputText
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            className={errors.password ? "p-invalid" : ""}
            placeholder="User password"
          />
          {!password && (
            <small className="field-hint">
              Password not available for users created before edit was added.
            </small>
          )}
          {errors.password && (
            <small className="p-error">{errors.password}</small>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EditUserForm;
