import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { dashboardService, type RoleOverview } from '../services/dashboard.service';

const labels = { recruiter: 'Industry workspace', faculty: 'Academic workspace', institution: 'Institution intelligence' };
const titles = { recruiter: 'Company profile', faculty: 'Faculty profile', institution: 'Institution overview' };

export default function RoleDashboard() {
  const [overview, setOverview] = useState<RoleOverview | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { void dashboardService.getOverview().then(setOverview).catch(() => setError('Unable to load your dashboard. Please refresh the page.')); }, []);
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!overview) return <div className="py-16 text-center text-sm text-slate-500">Loading your workspace…</div>;
  const details = Object.entries(overview.profile).filter(([, value]) => value && (!Array.isArray(value) || value.length));
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0d7c8a]">{labels[overview.role]}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#092b4c]">{titles[overview.role]}</h1></div>{overview.metrics.length > 0 && <section className="grid gap-4 sm:grid-cols-3">{overview.metrics.map((metric) => <Card key={metric.label}><CardContent><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-2 text-3xl font-bold text-[#092b4c]">{metric.value}</p></CardContent></Card>)}</section>}<Card><CardHeader><CardTitle>{overview.role === 'recruiter' ? 'Organisation details' : overview.role === 'faculty' ? 'Professional details' : 'Institution details'}</CardTitle></CardHeader><CardContent><dl className="grid gap-5 sm:grid-cols-2">{details.map(([key, value]) => <div key={key}><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</dt><dd className="mt-1 text-sm font-medium text-slate-700">{Array.isArray(value) ? value.join(', ') : value}</dd></div>)}</dl></CardContent></Card><Card><CardHeader><CardTitle>Next steps</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-slate-500">{overview.role === 'institution' ? 'Create assessments to begin collecting verified evidence of student skills.' : overview.role === 'faculty' ? 'Faculty collaboration and mentorship opportunities will appear here as they are published.' : 'Create an opportunity to begin building a candidate pipeline.'}</p></CardContent></Card></div>;
}
