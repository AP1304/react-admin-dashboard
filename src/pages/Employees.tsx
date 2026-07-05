import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./Users.css";
import EmployeeForm from "../components/employee/EmployeeForm";

import {
  type Employee,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { Tag } from "primereact/tag";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

const Employees = () => {
  const toast = useRef<Toast>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEmployees(page, rows, search.trim());

      setEmployees(
        response.data.map((emp) => ({
          ...emp,
          _id: emp._id ?? emp.id,
        }))
      );

      setTotalRecords(response.pagination.totalEmployees);
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load employees.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [page, rows, search]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogVisible(true);
  };

  const handleSave = async (employeeData: Employee) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(
          selectedEmployee._id || selectedEmployee.id!,
          employeeData
        );
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Employee updated successfully.",
          life: 3000,
        });
      } else {
        await createEmployee(employeeData);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Employee created successfully.",
          life: 3000,
        });
      }

      setDialogVisible(false);
      setSelectedEmployee(null);
      await loadEmployees();
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save employee.",
        life: 3000,
      });
    }
  };

  const handleDelete = (employee: Employee) => {
    setDeleteId(employee._id || employee.id || null);
  };

  const confirmDeleteAction = async () => {
    if (!deleteId) return;

    try {
      await deleteEmployee(deleteId);
      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Employee deleted successfully.",
        life: 3000,
      });
      setDeleteId(null);

      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadEmployees();
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete employee.",
        life: 3000,
      });
    }
  };

  const handlePageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);
    setRows(event.rows);
  };

  const handleDialogHide = () => {
    setDialogVisible(false);
    setSelectedEmployee(null);
  };

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && !value.trim()) return "-";
    return String(value);
  };

  const textBodyTemplate =
    (field: keyof Employee) => (rowData: Employee) =>
      formatCellValue(rowData[field]);

  const statusBodyTemplate = (rowData: Employee) => (
    <Tag
      value={rowData.status}
      severity={rowData.status === "Active" ? "success" : "secondary"}
    />
  );

  const joiningDateTemplate = (rowData: Employee) => {
    if (!rowData.joiningDate) return "-";
    return new Date(rowData.joiningDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const actionBodyTemplate = (rowData: Employee) => (
    <div className="actions-column">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="warning"
        onClick={() => handleEdit(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData)}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <ConfirmDialog
        visible={!!deleteId}
        onHide={() => setDeleteId(null)}
        acceptClassName="p-button-danger"
        message="Are you sure you want to delete this employee?"
        header="Delete Employee"
        icon="pi pi-exclamation-triangle"
        accept={confirmDeleteAction}
        reject={() => setDeleteId(null)}
      />

      <div className="users-page">
        <div className="users-header">
          <h2>Employee Management</h2>
          <Button
            label="Add Employee"
            icon="pi pi-plus"
            onClick={handleAdd}
          />
        </div>

        <div className="users-toolbar">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, email, or department..."
            />
          </IconField>
        </div>

        <DataTable
          value={employees}
          dataKey="_id"
          loading={loading}
          rows={rows}
          stripedRows
          emptyMessage="No employees match your search."
          loadingIcon="pi pi-spinner pi-spin"
        >
          <Column
            field="employeeId"
            header="Emp ID"
            body={textBodyTemplate("employeeId")}
            sortable
            style={{ width: "110px" }}
          />

          <Column
            field="firstName"
            header="First Name"
            body={textBodyTemplate("firstName")}
            sortable
          />

          <Column
            field="lastName"
            header="Last Name"
            body={textBodyTemplate("lastName")}
            sortable
          />

          <Column
            field="email"
            header="Email"
            body={textBodyTemplate("email")}
            sortable
          />

          <Column
            field="phone"
            header="Phone"
            body={textBodyTemplate("phone")}
          />

          <Column
            field="department"
            header="Department"
            body={textBodyTemplate("department")}
          />

          <Column
            field="designation"
            header="Designation"
            body={textBodyTemplate("designation")}
          />

          <Column
            header="Joining Date"
            body={joiningDateTemplate}
            style={{ width: "130px" }}
          />

          <Column
            header="Status"
            body={statusBodyTemplate}
            bodyClassName="status-column"
            headerClassName="status-column"
            style={{ width: "120px" }}
          />

          <Column
            header="Actions"
            body={actionBodyTemplate}
            bodyClassName="actions-column-cell"
            headerClassName="actions-column-cell"
            exportable={false}
            style={{ width: "140px" }}
          />
        </DataTable>

        <div className="table-footer">
          Showing {employees.length} of {totalRecords} employees
        </div>

        <Paginator
          first={(page - 1) * rows}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onPageChange={handlePageChange}
          className="mt-3"
        />

        <EmployeeForm
          visible={dialogVisible}
          employee={selectedEmployee}
          onHide={handleDialogHide}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default Employees;
