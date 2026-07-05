import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  getToken,
  getProfile,
  getStoredPassword,
  setStoredPassword,
  type User,
} from "../../services/authService";

export type Role = "admin" | "user";

type AuthContextType = {
  user: User | null;
  loginPassword: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateLoginPassword: (password: string) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginPassword, setLoginPassword] = useState<string | null>(() =>
    getStoredPassword()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        const userData: User = {
          id: (profile as Record<string, unknown>)._id as string || profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          theme: profile.theme,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setLoginPassword(getStoredPassword());
      } catch {
        logoutUser();
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setStoredPassword(email, password);
      setLoginPassword(password);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setLoginPassword(null);
  };

  const updateLoginPassword = (password: string) => {
    const email =
      user?.email ??
      (JSON.parse(localStorage.getItem("user") || "{}") as { email?: string })
        .email;

    if (email) {
      setStoredPassword(email, password);
    } else {
      localStorage.setItem("userPassword", password);
    }
    setLoginPassword(password);
  };

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      const userData: User = {
        id: (profile as Record<string, unknown>)._id as string || profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        theme: profile.theme,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch {
      logoutUser();
      setUser(null);
    }
  };

  const isAuthenticated = !!user && !!getToken();
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loginPassword,
        loading,
        login,
        logout,
        updateLoginPassword,
        isAuthenticated,
        isAdmin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
