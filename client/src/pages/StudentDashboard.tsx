import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, type StudentProfile } from '../services/student.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    department: '',
    year: 1,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        enrollmentNumber: data.enrollmentNumber,
        department: data.department,
        year: data.year,
      });
      setError('');
    } catch (err: any) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentService.updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || 'Profile not found'}
      </div>
    );
  }

  const completion = 75; // placeholder

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <span className="text-sm text-gray-500">
          Welcome, {profile.name || user?.email}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle>Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">{completion}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${completion}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.skills?.length || 0}</div>
            <p className="text-sm text-gray-500">Skills added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.projects?.length || 0}</div>
            <p className="text-sm text-gray-500">Projects completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{profile.certifications?.length || 0}</div>
            <p className="text-sm text-gray-500">Certifications earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing && <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Enrollment Number"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                fullWidth
                required
              />
              <Input
                label="Year (1-5)"
                type="number"
                name="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                fullWidth
                required
              />
              <div className="flex space-x-2">
                <Button type="submit">Save</Button>
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollment Number</p>
                <p className="font-medium">{profile.enrollmentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{profile.year}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
        <CardContent>
          {profile.skills?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education - Simplified */}
      <Card>
        <CardHeader><CardTitle>Education</CardTitle></CardHeader>
        <CardContent>
          {profile.education?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No education entries yet</p>
          ) : (
            profile.education?.map((edu, index) => (
              <div key={index} className="p-3 border rounded-lg mb-2">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year} {edu.score && `· ${edu.score}`}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;