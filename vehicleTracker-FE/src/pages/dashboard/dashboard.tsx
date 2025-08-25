import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { LoadingSpinner } from "@/components/common";

export const DashboardPage: React.FC = () => {
  const isLoading = false;
  const error = null;
  const stats = {
    total: 150,
    active: 120,
    maintenance: 8,
    alerts: 3,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const totalVehicles = stats?.total || 0;
  const activeVehicles = stats?.active || 0;
  const maintenanceDue = stats?.maintenance || 0;
  const alerts = stats?.alerts || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vehicle tracking system overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalVehicles}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              All registered vehicles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {activeVehicles}
            </div>
            <p className="text-xs text-gray-600 mt-1">Currently operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Maintenance Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {maintenanceDue}
            </div>
            <p className="text-xs text-gray-600 mt-1">Require maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{alerts}</div>
            <p className="text-xs text-gray-600 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Vehicle VH001 started trip
                </span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Maintenance completed for VH003
                </span>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  New vehicle VH015 registered
                </span>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200">
                Add New Vehicle
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded border border-green-200">
                Generate Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-orange-50 hover:bg-orange-100 rounded border border-orange-200">
                Schedule Maintenance
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
