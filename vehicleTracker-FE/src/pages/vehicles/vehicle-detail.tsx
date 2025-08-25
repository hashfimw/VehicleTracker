import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Gauge, Fuel, Thermometer } from "lucide-react";
import {
  LoadingSpinner,
  StatusBadge,
  DataTable,
  Pagination,
} from "@/components/common";
import { useVehicle, useVehicleStatus } from "@/hooks";
import { VehicleStatus } from "@/types";
import {
  formatDateTime,
  formatSpeed,
  formatFuelLevel,
  formatEngineTemp,
} from "@/lib/utils";
import { DEFAULT_PAGINATION } from "@/lib/constants";

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicleId = parseInt(id || "0");

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [page, setPage] = useState(1);

  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(vehicleId);

  const {
    data: statuses,
    isLoading: statusLoading,
    error: statusError,
    isError: isStatusError,
  } = useVehicleStatus({
    vehicleId,
    startDate,
    endDate,
  });

  const paginatedData = useMemo(() => {
    if (!statuses || !Array.isArray(statuses)) {
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        },
      };
    }

    const startIndex = (page - 1) * DEFAULT_PAGINATION.limit;
    const endIndex = startIndex + DEFAULT_PAGINATION.limit;
    const paginatedStatuses = statuses.slice(startIndex, endIndex);

    return {
      data: paginatedStatuses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(statuses.length / DEFAULT_PAGINATION.limit),
        totalCount: statuses.length,
      },
    };
  }, [statuses, page]);

  const statusColumns = [
    {
      key: "timestamp",
      header: "Timestamp",
      accessor: "timestamp" as keyof VehicleStatus,
      render: (value: Date) => (
        <div className="text-sm">{formatDateTime(value)}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: "status" as keyof VehicleStatus,
      render: (value: "trip" | "idle" | "stopped") => (
        <StatusBadge status={value} />
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (_: any, status: VehicleStatus) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>
            {status.latitude?.toFixed(4) || "N/A"},{" "}
            {status.longitude?.toFixed(4) || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "speed",
      header: "Speed",
      accessor: "speed" as keyof VehicleStatus,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Gauge className="w-4 h-4 text-gray-400" />
          <span>{formatSpeed(value)}</span>
        </div>
      ),
    },
    {
      key: "fuelLevel",
      header: "Fuel Level",
      accessor: "fuelLevel" as keyof VehicleStatus,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Fuel className="w-4 h-4 text-gray-400" />
          <span>{formatFuelLevel(value)}</span>
        </div>
      ),
    },
    {
      key: "engineTemp",
      header: "Engine Temp",
      accessor: "engineTemp" as keyof VehicleStatus,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-gray-400" />
          <span>{formatEngineTemp(value)}</span>
        </div>
      ),
    },
  ];

  if (vehicleLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vehicle && !vehicleLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vehicle not found</p>
        {vehicleError && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <pre className="text-sm text-red-600">
              {JSON.stringify(vehicleError, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Vehicle Details - {vehicle?.license_plate || ""}
        </h1>
        {vehicle && (
          <p className="text-gray-600">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </p>
        )}
      </div>
      {vehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  License Plate
                </Label>
                <p className="text-lg font-semibold">
                  {vehicle.license_plate || ""}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Brand & Model
                </Label>
                <p className="text-lg font-semibold">
                  {vehicle.brand} {vehicle.model}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Year
                </Label>
                <p className="text-lg font-semibold">{vehicle.year}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Color
                </Label>
                <p className="text-lg font-semibold capitalize">
                  {vehicle.color}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Fuel Type
                </Label>
                <p className="text-lg font-semibold capitalize">
                  {vehicle.fuel_type || ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Vehicle Status History
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm whitespace-nowrap"
                >
                  From:
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="endDate" className="text-sm whitespace-nowrap">
                  To:
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-auto"
                />
              </div>
            </div>
          </div>
          {statuses && Array.isArray(statuses) && (
            <p className="text-sm text-gray-600 mt-2">
              Total Records: {paginatedData.pagination.totalCount}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isStatusError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading status data</p>
              <div className="bg-red-100 p-4 rounded-lg">
                <pre className="text-sm text-red-600">
                  {JSON.stringify(statusError, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                data={paginatedData.data}
                columns={statusColumns}
                loading={statusLoading}
                emptyMessage={`No status data found for the period ${startDate} - ${endDate}`}
              />
              {paginatedData.pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={paginatedData.pagination.currentPage}
                    totalPages={paginatedData.pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
