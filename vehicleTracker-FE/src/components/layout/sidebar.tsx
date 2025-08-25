import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Car, Users, FileText, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useAuthStore, useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", href: "/vehicles", icon: Car },
  { name: "Reports", href: "/reports", icon: FileText },
];

const adminNavigation = [{ name: "Users", href: "/users", icon: Users }];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const isAdmin = user?.role === "admin";
  const allNavigation = isAdmin
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Vehicle Tracker</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {allNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {user?.role}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
