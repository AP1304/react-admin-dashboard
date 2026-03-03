import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Dropdown } from "primereact/dropdown";
import { useAuth } from "../features/auth/AuthContext";
import StatCard from "../components/StatCard";
import Card from "../components/ui/Card";
import "./Dashboard.css";

const Analytics = () => {
  const { isAdmin } = useAuth();
  const [range, setRange] = useState("monthly");

  const options = [
    { label: "Last 3 Months", value: "weekly" },
    { label: "Last 6 Months", value: "monthly" },
    { label: "Full Year", value: "yearly" },
  ];

  const data = [
    { name: "Jan", revenue: 4000, users: 240, orders: 120 },
    { name: "Feb", revenue: 3000, users: 139, orders: 98 },
    { name: "Mar", revenue: 5000, users: 980, orders: 200 },
    { name: "Apr", revenue: 4780, users: 390, orders: 150 },
    { name: "May", revenue: 5890, users: 480, orders: 180 },
    { name: "Jun", revenue: 6390, users: 380, orders: 220 },
  ];

  const pieData = [
    { name: "Desktop", value: 400 },
    { name: "Mobile", value: 300 },
    { name: "Tablet", value: 200 },
  ];

  const COLORS = ["#4f46e5", "#22c55e", "#f97316"];

  const totalUsers = useMemo(
    () => data.reduce((sum, item) => sum + item.users, 0),
    []
  );

  return (
    <div className="dashboard-container">
      <h1>Analytics Overview</h1>

      <div className="analytics-filter">
        <Dropdown
          value={range}
          options={options}
          onChange={(e) => setRange(e.value)}
          placeholder="Select Range"
        />
      </div>

      <div className="stats-grid">
        <StatCard title="Total Users" value={`${totalUsers}`} change="+8%" />
      </div>

      <div className="charts-grid">
        <Card title="Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="User Growth">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="users" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Orders Trend">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Area type="monotone" dataKey="orders" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {isAdmin && (
          <Card title="Device Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={100} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;