import api from "./api";

export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  phone?: string;
  status?: "Active" | "Inactive";
  password?: string;
}

const MANAGED_USER_PASSWORDS_KEY = "managedUserPasswords";

const readPasswordMap = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(MANAGED_USER_PASSWORDS_KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveManagedUserPassword = (userId: string, password: string) => {
  const map = readPasswordMap();
  map[userId] = password;
  localStorage.setItem(MANAGED_USER_PASSWORDS_KEY, JSON.stringify(map));
};

export const getManagedUserPassword = (userId: string): string => {
  return readPasswordMap()[userId] ?? "";
};

export const removeManagedUserPassword = (userId: string) => {
  const map = readPasswordMap();
  delete map[userId];
  localStorage.setItem(MANAGED_USER_PASSWORDS_KEY, JSON.stringify(map));
};

export const getUsers = async (): Promise<ManagedUser[]> => {
  const response = await api.get("/users");
  return response.data.data;
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<ManagedUser> => {
  const response = await api.post("/users", payload);
  const user = response.data.data;
  saveManagedUserPassword(user._id, payload.password);
  return user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
  removeManagedUserPassword(id);
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<ManagedUser> => {
  const response = await api.put(`/users/${id}`, payload);
  if (payload.password) {
    saveManagedUserPassword(id, payload.password);
  }
  return response.data.data;
};
