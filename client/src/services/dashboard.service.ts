import api from './api';

export interface DashboardMetric { label: string; value: number; }
export interface RoleOverview {
  role: 'recruiter' | 'faculty' | 'institution';
  profile: Record<string, string | string[]>;
  metrics: DashboardMetric[];
}

export const dashboardService = {
  getOverview: async (): Promise<RoleOverview> => (await api.get('/dashboard/overview')).data.data,
};
