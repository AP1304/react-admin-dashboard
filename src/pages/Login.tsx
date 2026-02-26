import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

type LoginFormInputs = {
  email: string;
  password: string;
  remember: boolean;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);

    // 🔥 Call centralized login from AuthContext
    login(data.email, data.remember);

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Welcome Back 👋</h2>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        {/* Remember Me */}
        <div className="remember-me">
          <input type="checkbox" {...register("remember")} />
          <label>Remember Me</label>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;