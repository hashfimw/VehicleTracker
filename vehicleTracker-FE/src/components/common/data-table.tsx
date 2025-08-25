import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "./loading-spinner";
import { Pagination } from "./pagination";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  accessor?: keyof T;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    total?: number;
  };
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  showPaginationAlways?: boolean;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  loading = false,
  pagination,
  onRowClick,
  emptyMessage = "No data available",
  showPaginationAlways = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data || !Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Invalid data format</div>
      </div>
    );
  }

  const shouldShowPagination =
    pagination &&
    (showPaginationAlways ||
      pagination.totalPages > 1 ||
      (pagination.total && pagination.total > data.length));

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={`header-${String(column.key)}-${index}`}
                className={column.className}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, itemIndex) => (
              <TableRow
                key={`row-${item.id || itemIndex}`}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((column, columnIndex) => {
                  const cellKey = `cell-${item.id || itemIndex}-${String(
                    column.key
                  )}-${columnIndex}`;

                  let cellContent: React.ReactNode = "-";

                  try {
                    if (column.render) {
                      const accessor = column.accessor || column.key;
                      const value =
                        typeof accessor === "string" && accessor in item
                          ? item[accessor as keyof T]
                          : undefined;
                      cellContent = column.render(value, item);
                    } else {
                      const accessor = column.accessor || column.key;
                      if (typeof accessor === "string" && accessor in item) {
                        const value = item[accessor as keyof T];
                        cellContent =
                          value !== null && value !== undefined
                            ? String(value)
                            : "-";
                      }
                    }
                  } catch (error) {
                    console.error(`Error rendering cell ${cellKey}:`, error);
                    cellContent = "Error";
                  }

                  return (
                    <TableCell key={cellKey} className={column.className}>
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {shouldShowPagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
