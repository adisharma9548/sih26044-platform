import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/common/PrivateRoute';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { DashboardRedirect } from './pages/DashboardRedirect';

// Placeholder pages for other roles (we'll build them later)
const RecruiterDashboard = () => <div>Recruiter Dashboard</div>;
const FacultyDashboard = () => <div>Faculty Dashboard</div>;
const InstitutionDashboard = () => <div>Institution Dashboard</div>;

// Sidebar items for each role
const studentSidebarItems = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/profile', label: 'Profile' },
  { path: '/student/skills', label: 'Skills' },
  { path: '/student/applications', label: 'Applications' },
];

const recruiterSidebarItems = [
  { path: '/recruiter/dashboard', label: 'Dashboard' },
  { path: '/recruiter/jobs', label: 'Jobs' },
  { path: '/recruiter/applications', label: 'Applications' },
];

const facultySidebarItems = [
  { path: '/faculty/dashboard', label: 'Dashboard' },
  { path: '/faculty/mentorship', label: 'Mentorship' },
  { path: '/faculty/research', label: 'Research' },
];

const institutionSidebarItems = [
  { path: '/institution/dashboard', label: 'Dashboard' },
  { path: '/institution/students', label: 'Students' },
  { path: '/institution/analytics', label: 'Analytics' },
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes – role‑specific dashboards */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<DashboardRedirect />} />
          </Route>

          <Route path="/student" element={<PrivateRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout sidebarItems={studentSidebarItems} />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<div className="p-4">Student Profile</div>} />
              <Route path="skills" element={<div className="p-4">Skills Management</div>} />
              <Route path="applications" element={<div className="p-4">My Applications</div>} />
            </Route>
          </Route>

          <Route path="/recruiter" element={<PrivateRoute allowedRoles={['recruiter']} />}>
            <Route element={<DashboardLayout sidebarItems={recruiterSidebarItems} />}>
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobs" element={<div className="p-4">Manage Jobs</div>} />
              <Route path="applications" element={<div className="p-4">View Applications</div>} />
            </Route>
          </Route>

          <Route path="/faculty" element={<PrivateRoute allowedRoles={['faculty']} />}>
            <Route element={<DashboardLayout sidebarItems={facultySidebarItems} />}>
              <Route path="dashboard" element={<FacultyDashboard />} />
              <Route path="mentorship" element={<div className="p-4">Mentorship</div>} />
              <Route path="research" element={<div className="p-4">Research</div>} />
            </Route>
          </Route>

          <Route path="/institution" element={<PrivateRoute allowedRoles={['institution']} />}>
            <Route element={<DashboardLayout sidebarItems={institutionSidebarItems} />}>
              <Route path="dashboard" element={<InstitutionDashboard />} />
              <Route path="students" element={<div className="p-4">Student Management</div>} />
              <Route path="analytics" element={<div className="p-4">Analytics</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;