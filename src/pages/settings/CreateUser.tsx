import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Card from "../../components/ui/Card";
import EditUserForm from "../../components/user/EditUserForm";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type ManagedUser,
  type UpdateUserPayload,
} from "../../services/userManagementService";

const CreateUser = () => {
  const toast = useRef<Toast>(null);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Name, email, and password are required.",
        life: 3000,
      });
      return;
    }

    if (newUserPassword.length < 6) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Password must be at least 6 characters.",
        life: 3000,
      });
      return;
    }

    try {
      setCreateUserLoading(true);
      await createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        phone: newUserPhone,
      });
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPhone("");
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User created successfully.",
        life: 3000,
      });
      loadUsers();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create user.";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    } finally {
      setCreateUserLoading(false);
    }
  };

  const handleEditUser = (user: ManagedUser) => {
    setSelectedUser(user);
    setEditDialogVisible(true);
  };

  const handleUpdateUser = async (id: string, payload: UpdateUserPayload) => {
    try {
      await updateUser(id, payload);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User updated successfully.",
        life: 3000,
      });
      loadUsers();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update user.";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
      throw error;
    }
  };

  const handleDeleteUser = (user: ManagedUser) => {
    confirmDialog({
      message: `Are you sure you want to delete "${user.name || user.email}"?`,
      header: "Delete User",
      icon: "pi pi-trash",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteUser(user._id);
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "User deleted successfully.",
            life: 3000,
          });
          loadUsers();
        } catch (error) {
          console.error(error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete user.",
            life: 3000,
          });
        }
      },
    });
  };

  const actionsBody = (rowData: ManagedUser) => (
    <div style={{ display: "flex", gap: "4px" }}>
      <Button
        icon="pi pi-pencil"
        severity="info"
        size="small"
        text
        onClick={() => handleEditUser(rowData)}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        size="small"
        text
        onClick={() => handleDeleteUser(rowData)}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Card title="Create User">
        <div className="settings-form">
          <h4 style={{ margin: "0 0 12px 0" }}>Create New User</h4>

          <div className="settings-field">
            <label>Name</label>
            <InputText
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="settings-field">
            <label>Email</label>
            <InputText
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="settings-field">
            <label>Password</label>
            <Password
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              toggleMask
              feedback
              inputClassName="w-full"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="settings-field">
            <label>Phone</label>
            <InputText
              value={newUserPhone}
              maxLength={10}
              keyfilter="int"
              onChange={(e) =>
                setNewUserPhone(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Optional"
            />
          </div>

          <div className="settings-actions">
            <Button
              label="Create User"
              icon="pi pi-user-plus"
              loading={createUserLoading}
              onClick={handleCreateUser}
            />
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h4 style={{ margin: "0 0 12px 0" }}>Existing Users</h4>
          <DataTable
            value={users}
            loading={usersLoading}
            emptyMessage="No users created yet."
            size="small"
            stripedRows
          >
            <Column field="name" header="Name" />
            <Column field="email" header="Email" />
            <Column field="phone" header="Phone" />
            <Column field="status" header="Status" />
            <Column header="Actions" body={actionsBody} />
          </DataTable>
        </div>
      </Card>

      <EditUserForm
        visible={editDialogVisible}
        user={selectedUser}
        onHide={() => {
          setEditDialogVisible(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
      />
    </>
  );
};

export default CreateUser;
