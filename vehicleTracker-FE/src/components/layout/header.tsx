import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { useUIStore } from "@/store";

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Dashboard" }) => {
  const { setSidebarOpen } = useUIStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
