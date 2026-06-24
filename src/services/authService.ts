import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL + "/auth";

export const loginUser = async (
  email: string,
  password: string,
  role: string
) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
      role,
    }
  );

  return response.data;
};

export const signupUser = async (
  email: string,
  password: string,
  role: string
) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    {
      email,
      password,
      role,
    }
  );

  return response.data;
};