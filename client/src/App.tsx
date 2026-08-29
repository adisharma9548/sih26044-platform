import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';

const studentSidebarItems = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/profile', label: 'Profile' },
  { path: '/student/skills', label: 'Skills' },
  { path: '/student/applications', label: 'Applications' },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/student" element={<DashboardLayout sidebarItems={studentSidebarItems} />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<div className="p-4">Student Profile (Coming Soon)</div>} />
          <Route path="skills" element={<div className="p-4">Skills Management (Coming Soon)</div>} />
          <Route path="applications" element={<div className="p-4">My Applications (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;