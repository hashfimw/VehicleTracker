import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export interface MainLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children} {/* ← Gunakan children, bukan <Outlet /> */}
        </main>
      </div>
    </div>
  );
};
