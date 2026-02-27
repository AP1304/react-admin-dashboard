import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import Card from "../components/ui/Card";
import "./Dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.length);
        setOrders(data.length);
      });

    fetch("https://jsonplaceholder.typicode.com/carts")
      .then((res) => res.json())
      .then((data) => {
        const total = data.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum: number, cart: any) => sum + cart.total,
          0
        );
        setRevenue(total);
      });
  }, []);

  const stats = useMemo(
    () => [
      { title: "Total Users", value: users, label: "Live Data" },
      { title: "Total Revenue", value: `$${revenue}`, label: "From API" },
      { title: "Total Orders", value: orders, label: "Live Orders" },
      { title: "Active Sessions", value: 128, label: "Realtime" },
    ],
    [users, revenue, orders]
  );

  const userGrowthData = [
    { name: "Jan", users: 50 },
    { name: "Feb", users: 100 },
    { name: "Mar", users: 150 },
    { name: "Apr", users: 200 },
    { name: "May", users: 250 },
    { name: "Jun", users: 300 },
  ];

  const revenueData = [
    { name: "Cart 1", revenue: 100000 },
    { name: "Cart 2", revenue: 5000 },
    { name: "Cart 3", revenue: 15000 },
    { name: "Cart 4", revenue: 1000 },
    { name: "Cart 5", revenue: 8000 },
    { name: "Cart 6", revenue: 35000 },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <h4>{stat.title}</h4>
            <h2>{stat.value}</h2>
            <p className="green-text">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <Card title="User Growth">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Analytics">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Bar dataKey="revenue" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 