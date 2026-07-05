import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const Analytics = lazy(() => import("./pages/Analytics"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const ProfileInformation = lazy(
  () => import("./pages/settings/ProfileInformation")
);
const ChangePassword = lazy(() => import("./pages/settings/ChangePassword"));
const CreateUser = lazy(() => import("./pages/settings/CreateUser"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div
              style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route path="analytics" element={<Analytics />} />
              <Route
                path="settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SettingsLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileInformation />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="create-user" element={<CreateUser />} />
              </Route>
            </Route>

            {/* Redirect old /users route */}
            <Route path="/users" element={<Navigate to="/employees" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
