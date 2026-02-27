import { createContext, useContext, useEffect, useState } from "react";

export type Role = "admin" | "user";

interface User {
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: Role
  ): Promise<boolean> => {
    setLoading(true);

    // 🔥 Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 🔥 Demo credentials
    const demoUsers = [
      { email: "admin@test.com", password: "admin123", role: "admin" as Role },
      { email: "user@test.com", password: "user123", role: "user" as Role },
    ];

    const foundUser = demoUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = { email: foundUser.email, role: foundUser.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};