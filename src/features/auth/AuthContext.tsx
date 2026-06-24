/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loginUser } from "../../services/authService";

export type Role = "admin" | "user";

interface User {
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: Role
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    const token =
      localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: Role
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const data = await loginUser(
        email,
        password,
        role
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const isAdmin =
    user?.role === "admin";

  const isUser =
    user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};