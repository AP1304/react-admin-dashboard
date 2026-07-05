import api from "./api";

export interface DashboardCards {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departments: number;
}

export interface RecentEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
}

export interface ChartItem {
  name: string;
  count: number;
}

export interface DashboardCharts {
  byDepartment: ChartItem[];
  byDesignation: ChartItem[];
}

export interface ActivityItem {
  _id: string;
  action: "created" | "updated" | "deleted";
  employeeName: string;
  performedBy?: { name: string };
  createdAt: string;
}

export const getDashboardCards = async (): Promise<DashboardCards> => {
  const response = await api.get("/dashboard/cards");
  return response.data.data;
};

export const getRecentEmployees = async (): Promise<RecentEmployee[]> => {
  const response = await api.get("/dashboard/recent");
  return response.data.data;
};

export const getDashboardCharts = async (): Promise<DashboardCharts> => {
  const response = await api.get("/dashboard/charts");
  return response.data.data;
};

export const getActivities = async (): Promise<ActivityItem[]> => {
  const response = await api.get("/dashboard/activities");
  return response.data.data;
};
