import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import type { Employee } from "../../services/employeeService";

import "./EmployeeForm.css";

interface EmployeeFormProps {
  visible: boolean;
  employee?: Employee | null;
  onHide: () => void;
  onSave: (employee: Employee) => Promise<void>;
}

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const emptyEmployee: Employee = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  status: "Active",
  joiningDate: new Date().toISOString(),
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  employee,
  onHide,
  onSave,
}) => {
  const [formData, setFormData] = useState<Employee>(emptyEmployee);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
    } else {
      setFormData({ ...emptyEmployee, joiningDate: new Date().toISOString() });
    }
    setErrors({});
  }, [employee, visible]);

  const handleChange = <K extends keyof Employee>(
    field: K,
    value: Employee[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const validationErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      validationErrors.firstName = "First Name is required";

    if (!formData.lastName.trim())
      validationErrors.lastName = "Last Name is required";

    const email = formData.email.trim().toLowerCase();
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      validationErrors.phone = "Enter a valid 10 digit phone number";
    }

    if (!formData.department.trim())
      validationErrors.department = "Department is required";

    if (!formData.designation.trim())
      validationErrors.designation = "Designation is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload: Employee = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        designation: formData.designation.trim(),
      };

      await onSave(payload);
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
        label={employee ? "Update" : "Save"}
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
      header={employee ? "Edit Employee" : "Add New Employee"}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
      style={{ width: "700px", maxWidth: "95vw" }}
      className="employee-dialog"
    >
      <div className="employee-form-grid">
        <div className="form-field">
          <label>First Name</label>
          <InputText
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={errors.firstName ? "p-invalid" : ""}
          />
          {errors.firstName && (
            <small className="p-error">{errors.firstName}</small>
          )}
        </div>

        <div className="form-field">
          <label>Last Name</label>
          <InputText
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={errors.lastName ? "p-invalid" : ""}
          />
          {errors.lastName && (
            <small className="p-error">{errors.lastName}</small>
          )}
        </div>

        <div className="form-field">
          <label>Email</label>
          <InputText
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "p-invalid" : ""}
          />
          {errors.email && (
            <small className="p-error">{errors.email}</small>
          )}
        </div>

        <div className="form-field">
          <label>Phone</label>
          <InputText
            value={formData.phone}
            maxLength={10}
            keyfilter="int"
            onChange={(e) =>
              handleChange("phone", e.target.value.replace(/\D/g, ""))
            }
            className={errors.phone ? "p-invalid" : ""}
          />
          {errors.phone && (
            <small className="p-error">{errors.phone}</small>
          )}
        </div>

        <div className="form-field">
          <label>Department</label>
          <InputText
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className={errors.department ? "p-invalid" : ""}
          />
          {errors.department && (
            <small className="p-error">{errors.department}</small>
          )}
        </div>

        <div className="form-field">
          <label>Designation</label>
          <InputText
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            className={errors.designation ? "p-invalid" : ""}
          />
          {errors.designation && (
            <small className="p-error">{errors.designation}</small>
          )}
        </div>

        <div className="form-field">
          <label>Status</label>
          <Dropdown
            value={formData.status}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="Select Status"
            onChange={(e) => handleChange("status", e.value)}
          />
        </div>

        <div className="form-field">
          <label>Joining Date</label>
          <Calendar
            value={formData.joiningDate ? new Date(formData.joiningDate) : null}
            onChange={(e) =>
              handleChange(
                "joiningDate",
                e.value ? (e.value as Date).toISOString() : ""
              )
            }
            dateFormat="dd/mm/yy"
            showIcon
            className={errors.joiningDate ? "p-invalid" : ""}
          />
          {errors.joiningDate && (
            <small className="p-error">{errors.joiningDate}</small>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EmployeeForm;
