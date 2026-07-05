import api from "./api";

export interface AdminSettings {
  _id: string;
  name: string;
  email: string;
  phone: string;
  theme: "light" | "dark";
}

export const getSettings = async (): Promise<AdminSettings> => {
  const response = await api.get("/settings");
  return response.data.data;
};

export const updateSettings = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  theme?: string;
}): Promise<AdminSettings> => {
  const response = await api.put("/settings", data);
  return response.data.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put("/settings/password", data);
};
