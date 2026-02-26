/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (email: string, remember: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  // 🔹 Restore user on page refresh
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(storedUser);
    }
  }, []);

  const login = (email: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem("user", email);
    } else {
      sessionStorage.setItem("user", email);
    }

    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};