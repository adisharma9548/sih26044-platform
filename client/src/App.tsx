import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/common/PrivateRoute';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import { DashboardRedirect } from './pages/DashboardRedirect';
import InstitutionAssessments from './pages/InstitutionAssessments';
import RoleDashboard from './pages/RoleDashboard';
import AssessmentCenter from './pages/StudentDashboard/AssessmentCenter';
import StudentOpportunities from './pages/StudentOpportunities';
import RecruiterOpportunities from './pages/RecruiterOpportunities';

// Sidebar items for each role
const studentSidebarItems = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/profile', label: 'Profile' },
  { path: '/student/skills', label: 'Skills' },
  { path: '/student/assessments', label: 'Assessments' },
  { path: '/student/documents', label: 'Documents' },
  { path: '/student/opportunities', label: 'Opportunities' },
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
  { path: '/institution/assessments', label: 'Assessments' },
  { path: '/institution/analytics', label: 'Analytics' },
];

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes – role-specific dashboards */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<DashboardRedirect />} />
            </Route>

            <Route path="/student" element={<PrivateRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout sidebarItems={studentSidebarItems} />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<div className="p-4">Student Profile</div>} />
                <Route path="skills" element={<div className="p-4">Skills Management</div>} />
                <Route path="assessments" element={<AssessmentCenter />} />
                <Route path="documents" element={<div className="p-4">My Documents</div>} />
                <Route path="opportunities" element={<StudentOpportunities />} />
              </Route>
            </Route>

            <Route path="/recruiter" element={<PrivateRoute allowedRoles={['recruiter']} />}>
              <Route element={<DashboardLayout sidebarItems={recruiterSidebarItems} />}>
                <Route path="dashboard" element={<RoleDashboard />} />
                <Route path="jobs" element={<RecruiterOpportunities />} />
                <Route path="applications" element={<RoleDashboard />} />
              </Route>
            </Route>

            <Route path="/faculty" element={<PrivateRoute allowedRoles={['faculty']} />}>
              <Route element={<DashboardLayout sidebarItems={facultySidebarItems} />}>
                <Route path="dashboard" element={<RoleDashboard />} />
                <Route path="mentorship" element={<RoleDashboard />} />
                <Route path="research" element={<RoleDashboard />} />
              </Route>
            </Route>

            <Route path="/institution" element={<PrivateRoute allowedRoles={['institution']} />}>
              <Route element={<DashboardLayout sidebarItems={institutionSidebarItems} />}>
                <Route path="dashboard" element={<RoleDashboard />} />
                <Route path="students" element={<RoleDashboard />} />
                <Route path="assessments" element={<InstitutionAssessments />} />
                <Route path="analytics" element={<RoleDashboard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
