import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Calendar } from "lucide-react";
import { LoadingSpinner, Pagination } from "@/components/common";
import { useDownloadReport, useReportData } from "@/hooks";
import { formatDate } from "@/lib/utils";

export const ReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedVehicles, _setSelectedVehicles] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const { data: reportData, isLoading: reportLoading } = useReportData({
    startDate,
    endDate,
    vehicleIds: selectedVehicles.length > 0 ? selectedVehicles : undefined,
  });

  const downloadReportMutation = useDownloadReport();

  const paginatedReports = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) {
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        },
      };
    }

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = reportData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(reportData.length / ITEMS_PER_PAGE),
        totalCount: reportData.length,
      },
    };
  }, [reportData, page]);

  const handleDownloadReport = () => {
    downloadReportMutation.mutate({
      startDate,
      endDate,
      vehicleIds: selectedVehicles.length > 0 ? selectedVehicles : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and download vehicle reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleDownloadReport}
                disabled={downloadReportMutation.isPending}
                className="flex items-center gap-2"
              >
                {downloadReportMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Excel Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Preview
            </CardTitle>
            {reportData && reportData.length > 0 && (
              <div className="text-sm text-gray-600">
                Total Vehicles: {paginatedReports.pagination.totalCount}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reportLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : paginatedReports.data.length > 0 ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Report Period: {formatDate(startDate)} - {formatDate(endDate)}
              </div>

              {paginatedReports.data.map((vehicleReport) => (
                <div
                  key={vehicleReport.vehicle.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {vehicleReport.vehicle.license_plate}
                      </h3>
                      <p className="text-gray-600">
                        {vehicleReport.vehicle.brand}{" "}
                        {vehicleReport.vehicle.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Records</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {vehicleReport.statuses.length}
                      </p>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-md">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total Trips</p>
                      <p className="font-semibold">
                        {vehicleReport.summary.totalTrips}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Idle Time</p>
                      <p className="font-semibold">
                        {vehicleReport.summary.totalIdleTime}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Stopped Time</p>
                      <p className="font-semibold">
                        {vehicleReport.summary.totalStoppedTime}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold">
                        {vehicleReport.summary.totalDistance.toFixed(1)} km
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Avg Speed</p>
                      <p className="font-semibold">
                        {vehicleReport.summary.averageSpeed.toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {paginatedReports.pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={paginatedReports.pagination.currentPage}
                    totalPages={paginatedReports.pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No data available for the selected period. Please adjust your
              filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
