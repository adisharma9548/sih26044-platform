import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user) {
      const roleMap: Record<string, string> = {
        student: '/student/dashboard',
        recruiter: '/recruiter/dashboard',
        industry: '/recruiter/dashboard',
        faculty: '/faculty/dashboard',
        institution: '/institution/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(roleMap[user.role] || '/');
    }
  }, [user, isAuthenticated, navigate]);

  return <div className="flex items-center justify-center h-64 text-muted">Redirecting…</div>;
};