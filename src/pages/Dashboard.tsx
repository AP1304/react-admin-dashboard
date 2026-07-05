import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Card from "../components/ui/Card";
import {
  getDashboardCards,
  getRecentEmployees,
  getDashboardCharts,
  getActivities,
  type DashboardCards,
  type RecentEmployee,
  type DashboardCharts,
  type ActivityItem,
} from "../services/dashboardService";
import "./Dashboard.css";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

const ACTION_LABELS: Record<string, string> = {
  created: "Added",
  updated: "Updated",
  deleted: "Deleted",
};

const ACTION_COLORS: Record<string, string> = {
  created: "#22c55e",
  updated: "#f59e0b",
  deleted: "#ef4444",
};

const Dashboard = () => {
  const [cards, setCards] = useState<DashboardCards | null>(null);
  const [recent, setRecent] = useState<RecentEmployee[]>([]);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardsData, recentData, chartsData, activitiesData] = await Promise.all([
          getDashboardCards(),
          getRecentEmployees(),
          getDashboardCharts(),
          getActivities(),
        ]);
        setCards(cardsData);
        setRecent(recentData);
        setCharts(chartsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard Overview</h1>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const stats = [
    { title: "Total Employees", value: cards?.totalEmployees ?? 0, color: "#4f46e5" },
    { title: "Active Employees", value: cards?.activeEmployees ?? 0, color: "#22c55e" },
    { title: "Inactive Employees", value: cards?.inactiveEmployees ?? 0, color: "#ef4444" },
    { title: "Departments", value: cards?.departments ?? 0, color: "#f59e0b" },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <h4>{stat.title}</h4>
            <h2 style={{ color: stat.color }}>{stat.value}</h2>
          </Card>
        ))}
      </div>

      {charts && (charts.byDepartment.length > 0 || charts.byDesignation.length > 0) && (
        <div className="charts-grid" style={{ marginBottom: "30px" }}>
          {charts.byDepartment.length > 0 && (
            <Card title="Employees by Department">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={charts.byDepartment}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={90}
                    label={({ name, count }) => `${name} (${count})`}
                  >
                    {charts.byDepartment.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {charts.byDesignation.length > 0 && (
            <Card title="Employees by Designation">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts.byDesignation}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      <div className="dashboard-bottom-grid">
        <Card title="Recent Employees">
          {recent.length === 0 ? (
            <p style={{ padding: "16px", color: "#6b7280" }}>
              No employees yet. Add your first employee to get started.
            </p>
          ) : (
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.department || "-"}</td>
                    <td>{emp.designation || "-"}</td>
                    <td>
                      {new Date(emp.joiningDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${emp.status === "Active" ? "active" : "inactive"}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="Recent Activity">
          {activities.length === 0 ? (
            <p style={{ padding: "16px", color: "#6b7280" }}>
              No activity recorded yet.
            </p>
          ) : (
            <ul className="activity-list">
              {activities.map((activity) => (
                <li key={activity._id} className="activity-item">
                  <span
                    className="activity-dot"
                    style={{ background: ACTION_COLORS[activity.action] || "#6b7280" }}
                  />
                  <div className="activity-content">
                    <span className="activity-text">
                      <strong>{activity.employeeName}</strong> was{" "}
                      {ACTION_LABELS[activity.action] || activity.action}
                    </span>
                    <span className="activity-time">
                      {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {activity.performedBy && ` by ${activity.performedBy.name}`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
