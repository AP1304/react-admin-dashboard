import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth, type Role } from "../features/auth/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    const isValid = validate();
    if (!isValid) return;

    setSubmitting(true);
    setErrors({});

    const success = await login(email, password, role);

    if (success) {
      navigate("/dashboard");
    } else {
      setErrors({ general: "Invalid credentials. Try demo accounts." });
    }

    setSubmitting(false);
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>SaaS Admin Dashboard</h2>

        {errors.general && (
          <div className="general-error">{errors.general}</div>
        )}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={submitting}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>

        <div className="form-group password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            disabled={submitting}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>

          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <select
          value={role}
          disabled={submitting}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleLogin}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Authenticating..." : "Login"}
        </button>

        {/* Demo credentials hint */}
        <div className="demo-info">
          Demo:
          <br />
          Admin → admin@test.com / admin123
          <br />
          User → user@test.com / user123
        </div>
      </div>
    </div>
  );
};

export default Login;