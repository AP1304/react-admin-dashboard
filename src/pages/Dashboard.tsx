import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface User {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const userGrowthData = users.map((user, index) => ({
    name: `User ${user.id}`,
    users: (index + 1) * 200,
  }));

  const revenueData = users.map((user, index) => ({
    name: `User ${user.id}`,
    revenue: (index + 1) * 500,
  }));

  if (loading) {
    return <div className="loading-skeleton">Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard Overview</h1>

      <div className="card-grid">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          change="+10% this month"
        />
        <StatCard
          title="Revenue"
          value={`$${users.length * 1200}`}
          change="+8% this month"
        />
        <StatCard title="Orders" value="320" change="+5% this month" />
        <StatCard title="Active Sessions" value="89" change="+2% today" />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Revenue Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;