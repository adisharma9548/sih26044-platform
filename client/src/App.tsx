import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/common/PrivateRoute';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentSkillGap } from './pages/student/StudentSkillGap';
import { StudentOpportunities } from './pages/student/StudentOpportunities';
import { StudentSkillMap } from './pages/student/StudentSkillMap';
import { StudentRoadmap } from './pages/student/StudentRoadmap';
import { StudentApplications } from './pages/student/StudentApplications';
import { DashboardRedirect } from './pages/DashboardRedirect';

// Placeholder for other roles
const RecruiterDashboard = () => <div className="p-6 text-muted">Recruiter Dashboard</div>;
const FacultyDashboard = () => <div className="p-6 text-muted">Faculty Dashboard</div>;
const InstitutionDashboard = () => <div className="p-6 text-muted">Institution Dashboard</div>;
const AdminDashboard = () => <div className="p-6 text-muted">Admin Dashboard</div>;

// Sidebar configs
const studentSidebarItems = [
  { path: '/student/dashboard', label: 'Overview' },
  { path: '/student/skill-map', label: 'Skill Map' },
  { path: '/student/skill-gap', label: 'Skill Gap' },
  { path: '/student/roadmap', label: 'Roadmap' },
  { path: '/student/opportunities', label: 'Opportunities' },
  { path: '/student/applications', label: 'Applications' },
];

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<DashboardRedirect />} />
            </Route>

            <Route path="/student" element={<PrivateRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout sidebarItems={studentSidebarItems} />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="skill-map" element={<StudentSkillMap />} />
                <Route path="skill-gap" element={<StudentSkillGap />} />
                <Route path="roadmap" element={<StudentRoadmap />} />
                <Route path="opportunities" element={<StudentOpportunities />} />
                <Route path="applications" element={<StudentApplications />} />
              </Route>
            </Route>

            <Route path="/recruiter" element={<PrivateRoute allowedRoles={['recruiter']} />}>
              <Route element={<DashboardLayout sidebarItems={[]} />}>
                <Route path="dashboard" element={<RecruiterDashboard />} />
              </Route>
            </Route>

            <Route path="/faculty" element={<PrivateRoute allowedRoles={['faculty']} />}>
              <Route element={<DashboardLayout sidebarItems={[]} />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
              </Route>
            </Route>

            <Route path="/institution" element={<PrivateRoute allowedRoles={['institution']} />}>
              <Route element={<DashboardLayout sidebarItems={[]} />}>
                <Route path="dashboard" element={<InstitutionDashboard />} />
              </Route>
            </Route>

            <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout sidebarItems={[]} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;