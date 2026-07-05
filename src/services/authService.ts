import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  theme: "light" | "dark";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", credentials);
  setStoredPassword(credentials.email, credentials.password);
  return response.data.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data.data;
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  theme?: string;
}): Promise<User> => {
  const response = await api.put("/auth/profile", data);
  return response.data.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put("/auth/change-password", data);
};

const PASSWORD_KEY = "userPassword";
const CREDENTIALS_KEY = "userCredentials";

export const setStoredPassword = (email: string, password: string) => {
  localStorage.setItem(PASSWORD_KEY, password);
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ email, password }));
};

export const getStoredPassword = (): string | null => {
  const direct = localStorage.getItem(PASSWORD_KEY);
  if (direct) {
    return direct;
  }

  try {
    const credentials = localStorage.getItem(CREDENTIALS_KEY);
    if (credentials) {
      const parsed = JSON.parse(credentials) as { password?: string };
      return parsed.password ?? null;
    }
  } catch {
    return null;
  }

  return null;
};

export const clearStoredPassword = () => {
  localStorage.removeItem(PASSWORD_KEY);
  localStorage.removeItem(CREDENTIALS_KEY);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearStoredPassword();
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
