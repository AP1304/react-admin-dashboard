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
}

interface Cart {
  id: number;
  total: number;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("https://dummyjson.com/users");
        const usersData = await usersRes.json();

        const cartsRes = await fetch("https://dummyjson.com/carts");
        const cartsData = await cartsRes.json();

        setUsers(usersData.users);
        setCarts(cartsData.carts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // User growth data
  const userGrowthData = users.slice(0, 6).map((user, index) => ({
    name: `User ${user.id}`,
    users: (index + 1) * 50,
  }));

  // Revenue data from carts
  const revenueData = carts.slice(0, 6).map((cart) => ({
    name: `Cart ${cart.id}`,
    revenue: cart.total,
  }));

  const totalRevenue = carts.reduce((sum, cart) => sum + cart.total, 0);

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
          change="Live Data"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
          change="From Carts API"
        />
        <StatCard
          title="Total Orders"
          value={carts.length.toString()}
          change="Live Orders"
        />
        <StatCard title="Active Sessions" value="89" change="Static demo" />
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