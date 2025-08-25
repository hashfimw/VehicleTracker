import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { DataTable, SearchInput, StatusBadge } from "@/components/common";
import { useVehicles } from "@/hooks";
import { VehicleWithLatestStatus } from "@/types";
import { formatDateTime, formatSpeed, formatFuelLevel } from "@/lib/utils";
import { DEFAULT_PAGINATION } from "@/lib/constants";

export const VehiclesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: vehiclesData,
    isLoading,
    error,
    isError,
  } = useVehicles({
    page,
    limit: DEFAULT_PAGINATION.limit,
    search: search || undefined,
  });

  const vehicles = vehiclesData?.vehicles || [];
  const pagination = vehiclesData?.pagination;

  const columns = [
    {
      key: "licensePlate",
      header: "License Plate",
      accessor: "licensePlate" as keyof VehicleWithLatestStatus,
      render: (value: string, vehicle: VehicleWithLatestStatus) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">
            {vehicle.brand} {vehicle.model}
          </div>
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
      accessor: "year" as keyof VehicleWithLatestStatus,
      render: (value: number) => <span>{value}</span>,
    },
    {
      key: "color",
      header: "Color",
      accessor: "color" as keyof VehicleWithLatestStatus,
      render: (value: string) => <span>{value}</span>,
    },
    {
      key: "fuelType",
      header: "Fuel Type",
      accessor: "fuelType" as keyof VehicleWithLatestStatus,
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (_: any, vehicle: VehicleWithLatestStatus) => {
        const status = vehicle.latestStatus;
        return status ? (
          <StatusBadge status={status.status} />
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      key: "speed",
      header: "Speed",
      render: (_: any, vehicle: VehicleWithLatestStatus) => {
        const status = vehicle.latestStatus;
        return status ? formatSpeed(status.speed) : "-";
      },
    },
    {
      key: "fuelLevel", // Changed key to be unique
      header: "Fuel Level",
      render: (_: any, vehicle: VehicleWithLatestStatus) => {
        const status = vehicle.latestStatus;
        return status ? formatFuelLevel(status.fuelLevel) : "-";
      },
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (_: any, vehicle: VehicleWithLatestStatus) => {
        const status = vehicle.latestStatus;
        return status ? (
          <div className="text-sm">{formatDateTime(status.timestamp)}</div>
        ) : (
          "-"
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, vehicle: VehicleWithLatestStatus) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vehicles/${vehicle.id}`);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">
          Error loading vehicles
        </h1>
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage and monitor your fleet</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vehicles ({vehicles?.length || 0})</CardTitle>
            <div className="flex items-center space-x-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search vehicles..."
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={vehicles}
            columns={columns}
            loading={isLoading}
            pagination={
              pagination
                ? {
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: setPage,
                  }
                : undefined
            }
            emptyMessage="No vehicles found"
          />
        </CardContent>
      </Card>
    </div>
  );
};
