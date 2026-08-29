import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Bridge the Gap Between <br />
          <span className="text-primary-600">Academia & Industry</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Skill mapping, internships, placements — all in one platform for students, faculty, and recruiters.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardHeader><CardTitle>For Students</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-600">Build your profile, showcase skills, get matched with internships and jobs.</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardHeader><CardTitle>For Recruiters</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-600">Post opportunities, find the right talent, manage applications efficiently.</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardHeader><CardTitle>For Faculty & Institutions</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-600">Foster industry collaborations, mentor students, track placements.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};