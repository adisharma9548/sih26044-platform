import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, type StudentProfile } from '../services/student.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import SkillsManagement from './StudentDashboard/SkillsManagement';
import EducationList from './StudentDashboard/EducationList';
import ProjectsList from './StudentDashboard/ProjectsList';
import CertificationsList from './StudentDashboard/CertificationsList';
import DocumentManagement from './StudentDashboard/DocumentManagement';

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
    } catch {
      setError('Unable to load your profile. Please refresh the page.');
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
    } catch {
      alert('Update failed. Please check your inputs.');
    }
  };

  const refreshProfile = () => fetchProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading your profile…</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800">
        {error || 'Profile not found.'}
      </div>
    );
  }

  // Calculate completion
  const completion = (() => {
    let score = 0;
    if (profile.name) score += 15;
    if (profile.enrollmentNumber) score += 10;
    if (profile.department) score += 10;
    if (profile.year) score += 10;
    if (profile.education?.length > 0) score += 15;
    if (profile.skills?.length > 0) score += 15;
    if (profile.projects?.length > 0) score += 15;
    if (profile.certifications?.length > 0) score += 10;
    return Math.min(score, 100);
  })();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Dashboard
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Welcome back, <span className="font-medium">{profile.name || user?.email}</span>
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{completion}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {completion === 100 ? 'Fully complete! 🎉' : 'Add more details to improve your profile'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.skills?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Skills added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Projects</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.projects?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projects showcased</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="dark:text-white">Certifications</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{profile.certifications?.length || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Certifications earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="dark:text-white">Personal Information</CardTitle>
            {!isEditing && (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
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
              <div className="flex space-x-3">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.enrollmentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                <p className="font-medium text-gray-900 dark:text-white">{profile.year}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Management */}
      <SkillsManagement skills={profile.skills || []} onUpdate={refreshProfile} />

      {/* Education */}
      <EducationList education={profile.education || []} onUpdate={refreshProfile} />

      {/* Projects */}
      <ProjectsList projects={profile.projects || []} onUpdate={refreshProfile} />

      {/* Certifications */}
      <CertificationsList certifications={profile.certifications || []} onUpdate={refreshProfile} />

      <DocumentManagement profile={profile} onUpdate={refreshProfile} />
    </div>
  );
};

export default StudentDashboard;
