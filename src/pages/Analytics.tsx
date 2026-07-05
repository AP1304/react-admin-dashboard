import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Dropdown } from "primereact/dropdown";
import Card from "../components/ui/Card";
import { getAnalytics, type AnalyticsData } from "../services/analyticsService";
import "./Dashboard.css";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

const STATUS_COLORS: Record<string, string> = {
  Active: "#22c55e",
  Inactive: "#ef4444",
};

const rangeOptions = [
  { label: "Last 3 Months", value: 3 },
  { label: "Last 6 Months", value: 6 },
  { label: "Last 12 Months", value: 12 },
];

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [months, setMonths] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getAnalytics(months);
        setData(result);
      } catch (error) {
        console.error("Analytics load error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [months]);

  if (loading && !data) {
    return (
      <div className="dashboard-container">
        <h1>Analytics Overview</h1>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  const hasData = data && (
    data.byDepartment.length > 0 ||
    data.byDesignation.length > 0 ||
    data.byStatus.length > 0 ||
    data.monthlyJoining.length > 0
  );

  return (
    <div className="dashboard-container">
      <h1>Analytics Overview</h1>

      <div className="analytics-filter">
        <Dropdown
          value={months}
          options={rangeOptions}
          onChange={(e) => setMonths(e.value)}
          placeholder="Select Range"
        />
      </div>

      {!hasData ? (
        <Card>
          <p style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>
            No employee data available for analytics. Add employees to see charts.
          </p>
        </Card>
      ) : (
        <div className="charts-grid">
          {data!.byDepartment.length > 0 && (
            <Card title="Employees by Department">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data!.byDepartment}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, count }) => `${name} (${count})`}
                  >
                    {data!.byDepartment.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {data!.byDesignation.length > 0 && (
            <Card title="Employees by Designation">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data!.byDesignation}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {data!.byStatus.length > 0 && (
            <Card title="Employees by Status">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data!.byStatus}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={100}
                    label={({ name, count }) => `${name} (${count})`}
                  >
                    {data!.byStatus.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {data!.monthlyJoining.length > 0 && (
            <Card title="Employees Joined Per Month">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data!.monthlyJoining}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
