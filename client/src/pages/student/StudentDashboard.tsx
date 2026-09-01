import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentService, type StudentProfile } from '../../services/student.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Progress } from '../../components/common/Progress';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentService.getProfile();
        setProfile(data);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" variant="rect" />)}
        </div>
        <Skeleton className="h-64" variant="rect" />
      </div>
    );
  }

  const readiness = profile?.careerReadiness || 72;
  const skillCount = profile?.skills?.length || 0;
  const projectCount = profile?.projects?.length || 0;
  const certCount = profile?.certifications?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold">Good morning, {profile?.name || user?.name || 'Student'}</h1>
          <p className="text-body text-muted">Here's your career readiness overview</p>
        </div>
        <Button variant="outline" size="sm">View Profile</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-body-sm text-muted">Career Readiness</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-h1 font-bold text-primary">{readiness}%</span>
              <Badge variant="success" size="sm">+12%</Badge>
            </div>
            <Progress value={readiness} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-body-sm text-muted">Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="text-h1 font-bold">{skillCount}</div>
            <p className="text-body-sm text-muted">Skills added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-body-sm text-muted">Projects</CardTitle></CardHeader>
          <CardContent>
            <div className="text-h1 font-bold">{projectCount}</div>
            <p className="text-body-sm text-muted">Projects completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-body-sm text-muted">Certifications</CardTitle></CardHeader>
          <CardContent>
            <div className="text-h1 font-bold">{certCount}</div>
            <p className="text-body-sm text-muted">Certifications earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Skill Gap Alert</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span>React</span><Badge variant="warning">Missing</Badge></div>
              <div className="flex items-center justify-between"><span>TypeScript</span><Badge variant="warning">Missing</Badge></div>
              <div className="flex items-center justify-between"><span>Node.js</span><Badge variant="success">Matched</Badge></div>
            </div>
            <Button size="sm" className="mt-4">View Skill Gap Analysis</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommended Opportunities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg flex justify-between items-center">
                <div><p className="font-medium">Frontend Developer Intern</p><p className="text-body-sm text-muted">Google • Remote</p></div>
                <Badge variant="primary">92% Match</Badge>
              </div>
              <div className="p-3 border border-border rounded-lg flex justify-between items-center">
                <div><p className="font-medium">Software Engineer Intern</p><p className="text-body-sm text-muted">Microsoft • Hybrid</p></div>
                <Badge variant="primary">85% Match</Badge>
              </div>
            </div>
            <Button size="sm" className="mt-4">View All Opportunities</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};