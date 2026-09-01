import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const stats = [
    { value: '10K+', label: 'Students' },
    { value: '200+', label: 'Companies' },
    { value: '150+', label: 'Institutions' },
    { value: '85%', label: 'Placement Rate' },
  ];
  const features = [
    { icon: '🎯', title: 'Skill Mapping', desc: 'Visualize your skills and identify gaps.' },
    { icon: '📈', title: 'Career Readiness', desc: 'Get a clear score and actionable insights.' },
    { icon: '🔗', title: 'Industry Collaboration', desc: 'Connect with companies and institutions.' },
    { icon: '🎓', title: 'Learning Pathways', desc: 'Personalized recommendations to bridge gaps.' },
  ];

  return (
    <div className="space-y-24">
      <section className="text-center py-12">
        <Badge variant="primary" size="md" className="mb-4">🚀 Smart India Hackathon 2026</Badge>
        <h1 className="text-display-lg font-bold tracking-tight max-w-4xl mx-auto">
          Bridge Skills. Connect Academia.<br />
          <span className="text-primary">Build Careers.</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto mt-4">
          A unified ecosystem connecting students, institutions and industry through intelligent skill mapping, internships and placement opportunities.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/register"><Button size="lg">Explore Platform</Button></Link>
          <Link to="/#how-it-works"><Button variant="outline" size="lg">See How It Works</Button></Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-6 bg-surface rounded-lg border border-border">
            <div className="text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-body-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h1 font-bold">How It Works</h2>
          <p className="text-body text-muted max-w-2xl mx-auto mt-2">From skill discovery to career success — a seamless journey for everyone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card key={i} hover>
              <CardHeader><CardTitle className="flex items-center gap-2"><span className="text-2xl">{f.icon}</span>{f.title}</CardTitle></CardHeader>
              <CardContent><p className="text-body-sm text-muted">{f.desc}</p></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary-muted rounded-2xl p-12 max-w-4xl mx-auto text-center">
        <h2 className="text-h1 font-bold">Ready to Bridge the Gap?</h2>
        <p className="text-body text-muted mt-2 max-w-xl mx-auto">Join thousands of students and companies already using SkillBridge.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link to="/register"><Button size="lg">Get Started Free</Button></Link>
          <Link to="/login"><Button variant="outline" size="lg">Sign In</Button></Link>
        </div>
      </section>
    </div>
  );
};