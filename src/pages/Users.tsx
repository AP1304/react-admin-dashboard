import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useAuth } from "../features/auth/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
}

const Users = () => {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (!isAdmin) {
    return <h2 style={{ padding: "20px" }}>Access Restricted</h2>;
  }

  const actionTemplate = (rowData: User) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => {
          setSelectedUser(rowData);
          setVisible(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() =>
          setUsers(users.filter((u) => u.id !== rowData.id))
        }
      />
    </div>
  );

  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>User Management</h2>

      <InputText
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        style={{ width: "250px" }}
      />
    </div>
  );

  return (
    <div className="dashboard-container">
      <DataTable
        value={users}
        paginator
        rows={5}
        header={header}
        globalFilter={globalFilter}
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="Phone" />
        <Column field="company.name" header="Company" />
        <Column header="Actions" body={actionTemplate} />
      </DataTable>

      <Dialog
        header="User Details"
        visible={visible}
        style={{ width: "400px" }}
        onHide={() => setVisible(false)}
        modal
      >
        {selectedUser && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Phone:</b> {selectedUser.phone}</p>
            <p><b>Company:</b> {selectedUser.company.name}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Users;