import api from "./api";

export interface Employee {
  _id?: string;
  id?: string;
  employeeId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: "Active" | "Inactive";
  joiningDate?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  pageSize: number;
}

export interface EmployeesResponse {
  data: Employee[];
  pagination: Pagination;
}

export const getEmployees = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<EmployeesResponse> => {
  const response = await api.get("/employees", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await api.get(`/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (
  employee: Omit<Employee, "_id" | "id" | "employeeId">
): Promise<Employee> => {
  const response = await api.post("/employees", employee);
  return response.data.data;
};

export const updateEmployee = async (
  id: string,
  employee: Partial<Employee>
): Promise<Employee> => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};
