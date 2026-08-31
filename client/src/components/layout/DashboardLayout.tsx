import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  sidebarItems: { path: string; label: string; icon?: React.ReactNode }[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebarItems }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-surface flex-1 p-5 sm:p-7">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
