import api from "./api";

export interface ChartItem {
  name: string;
  count: number;
}

export interface MonthlyItem {
  month: string;
  count: number;
}

export interface AnalyticsData {
  byDepartment: ChartItem[];
  byDesignation: ChartItem[];
  byStatus: ChartItem[];
  monthlyJoining: MonthlyItem[];
}

export const getAnalytics = async (months = 12): Promise<AnalyticsData> => {
  const response = await api.get("/analytics", {
    params: { months },
  });
  return response.data.data;
};
