import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MainLayout, ProtectedRoute } from "@/components/layout";
import { LoginPage } from "@/pages/auth/login";
import { DashboardPage } from "@/pages/dashboard/dashboard";
import { VehiclesListPage, VehicleDetailPage } from "@/pages/vehicles";
import { ReportsPage } from "@/pages/reports/reports";
import { UsersPage } from "@/pages/users/users";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout title="Dashboard">
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <MainLayout title="Vehicles">
                  <VehiclesListPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles/:id"
            element={
              <ProtectedRoute>
                <MainLayout title="Vehicle Details">
                  <VehicleDetailPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout title="Reports">
                  <ReportsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Users Management">
                  <UsersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
