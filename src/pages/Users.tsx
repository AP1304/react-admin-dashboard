import { useEffect, useMemo, useState } from "react";
import { fetchUsers } from "../services/userService";
import "./Users.css";

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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 🔥 Fetch Users from Service Layer
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 🔥 useMemo for filtering (Optimized)
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // 🔥 Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const handleSave = () => {
    if (!editingUser) return;

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? editingUser : user
    );

    setUsers(updatedUsers);
    setEditingUser(null);
  };

  return (
    <div>
      <h1>User Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{ padding: "8px", marginTop: "10px" }}
      />

      {loading && <p style={{ marginTop: "20px" }}>Loading users...</p>}

      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>{error}</p>
      )}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.company.name}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditingUser(user)}>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          backgroundColor: "#ef4444",
                          color: "white",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: "15px" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  marginRight: "5px",
                  backgroundColor:
                    currentPage === index + 1
                      ? "#4f46e5"
                      : "#e2e8f0",
                  color:
                    currentPage === index + 1 ? "white" : "black",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>

            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  email: e.target.value,
                })
              }
              style={{ marginTop: "10px" }}
            />

            <div style={{ marginTop: "15px" }}>
              <button onClick={handleSave}>Save</button>
              <button
                onClick={() => setEditingUser(null)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;