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
} from "recharts";

const Dashboard = () => {
  const data = [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 800 },
    { name: "Mar", users: 600 },
    { name: "Apr", users: 1200 },
    { name: "May", users: 900 },
    { name: "Jun", users: 1400 },
  ];

  return (
    <div>
      <h1>Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="card-grid">
        <StatCard title="Total Users" value="1,245" change="+12% this month" />
        <StatCard title="Revenue" value="$18,450" change="+8% this month" />
        <StatCard title="Orders" value="320" change="+5% this month" />
        <StatCard title="Active Sessions" value="89" change="+2% today" />
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h3>User Growth</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
    </div>
  );
};

export default Dashboard;