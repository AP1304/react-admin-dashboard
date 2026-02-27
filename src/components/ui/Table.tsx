import React from "react";
import "./Table.css";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function TableComponent<T extends object>({
  data,
  columns,
}: TableProps<T>) {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={String(col.accessor)}>
                {String(row[col.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Table = React.memo(TableComponent) as typeof TableComponent;