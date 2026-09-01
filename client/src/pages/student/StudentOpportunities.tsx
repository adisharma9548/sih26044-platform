import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const StudentOpportunities: React.FC = () => {
  const [search, setSearch] = useState('');
  const opportunities = [
    { id: 1, title: 'Frontend Engineering Intern', company: 'Google', location: 'Remote', type: 'Internship', match: 92, skills: ['React', 'TypeScript', 'CSS'], deadline: '2026-12-31' },
    { id: 2, title: 'Software Developer Intern', company: 'Microsoft', location: 'Hybrid', type: 'Internship', match: 85, skills: ['JavaScript', 'Python', 'Azure'], deadline: '2026-12-15' },
    { id: 3, title: 'Full Stack Developer', company: 'Amazon', location: 'On-site', type: 'Job', match: 78, skills: ['React', 'Node.js', 'AWS'], deadline: '2026-11-30' },
  ];

  const filterOptions = [{ value: 'all', label: 'All Types' }, { value: 'internship', label: 'Internships' }, { value: 'job', label: 'Jobs' }];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-h1 font-bold">Opportunities</h1><p className="text-body text-muted">Find your next career move</p></div>
        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          <Select options={filterOptions} defaultValue="all" className="w-40" />
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map(opp => (
          <Card key={opp.id} hover>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between w-full">
                <div><CardTitle className="text-lg">{opp.title}</CardTitle><p className="text-body-sm text-muted">{opp.company} • {opp.location}</p></div>
                <Badge variant="primary" size="md">{opp.match}% Match</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info" size="sm">{opp.type}</Badge>
                  {opp.skills.map(s => <Badge key={s} variant="default" size="sm">{s}</Badge>)}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-body-sm text-muted">Deadline: {opp.deadline}</span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};