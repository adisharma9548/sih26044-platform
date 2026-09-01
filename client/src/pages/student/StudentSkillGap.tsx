import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Progress } from '../../components/common/Progress';
import { Select } from '../../components/common/Select';

export const StudentSkillGap: React.FC = () => {
  const [targetRole, setTargetRole] = useState('frontend-developer');
  const roleOptions = [
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full Stack Developer' },
    { value: 'data-scientist', label: 'Data Scientist' },
  ];

  const skills = [
    { name: 'React', status: 'matched', progress: 100 },
    { name: 'JavaScript', status: 'matched', progress: 100 },
    { name: 'TypeScript', status: 'partial', progress: 60 },
    { name: 'Node.js', status: 'matched', progress: 100 },
    { name: 'Testing', status: 'missing', progress: 20 },
    { name: 'System Design', status: 'missing', progress: 10 },
  ];

  const statusColor = (s: string) => s === 'matched' ? 'success' : s === 'partial' ? 'warning' : 'danger';
  const statusLabel = (s: string) => s === 'matched' ? '✓ Matched' : s === 'partial' ? '! Partial' : '✕ Missing';

  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="text-h1 font-bold">Your Skill Gap</h1><p className="text-body text-muted">Identify gaps and get actionable recommendations</p></div>
      <div className="flex flex-wrap items-center gap-4">
        <Select label="Target Role" options={roleOptions} value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-64" />
        <Badge variant="primary" size="md">Current Readiness: 72%</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Skill Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant={statusColor(skill.status) as any} size="sm">{statusLabel(skill.status)}</Badge>
                </div>
                <Progress value={skill.progress} variant={skill.status === 'matched' ? 'success' : skill.status === 'partial' ? 'warning' : 'danger'} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top 3 Skills to Improve</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between"><div><h4 className="font-semibold">1. Testing</h4><p className="text-body-sm text-muted">Learn unit testing with Jest and React Testing Library</p></div><Badge variant="danger">Missing</Badge></div>
              <div className="flex gap-2 mt-2"><Button size="sm">View Courses</Button><Button size="sm" variant="outline">Start Project</Button></div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between"><div><h4 className="font-semibold">2. System Design</h4><p className="text-body-sm text-muted">Understand scalability, databases, and architecture</p></div><Badge variant="danger">Missing</Badge></div>
              <div className="flex gap-2 mt-2"><Button size="sm">View Courses</Button><Button size="sm" variant="outline">Read Resources</Button></div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between"><div><h4 className="font-semibold">3. TypeScript</h4><p className="text-body-sm text-muted">Deepen TypeScript knowledge with advanced types</p></div><Badge variant="warning">Partial</Badge></div>
              <div className="flex gap-2 mt-2"><Button size="sm">View Courses</Button><Button size="sm" variant="outline">Practice Exercises</Button></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button size="lg">Build My Roadmap</Button>
    </div>
  );
};