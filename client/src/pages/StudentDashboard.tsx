import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const StudentDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">75%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-500">4 verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-sm text-gray-500">2 in review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};