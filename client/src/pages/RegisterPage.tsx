import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { useAuth, type User } from '../contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<User['role']>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    enrollmentNumber: '',
    department: '',
    year: '',
    // For recruiter
    companyName: '',
    companyWebsite: '',
    description: '',
    industry: '',
    location: '',
    // For faculty
    designation: '',
    // For institution
    address: '',
    departments: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildProfileData = () => {
    switch (role) {
      case 'student':
        return {
          name: formData.name,
          enrollmentNumber: formData.enrollmentNumber,
          department: formData.department,
          year: parseInt(formData.year) || 1,
          education: [], // will be added later
        };
      case 'recruiter':
        return {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
          description: formData.description,
          industry: formData.industry,
          location: formData.location,
        };
      case 'faculty':
        return {
          name: formData.name,
          department: formData.department,
          designation: formData.designation,
        };
      case 'institution':
        return {
          name: formData.name,
          address: formData.address,
          departments: formData.departments.split(',').map(s => s.trim()).filter(Boolean),
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
        profileData: buildProfileData(),
      };
      await register(payload);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'institution', label: 'Institution' },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Select
              label="I am a"
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value as User['role'])}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
            {role === 'student' && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Enrollment Number"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Year (1-5)"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
            {role === 'recruiter' && (
              <>
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Company Website"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  fullWidth
                />
                <Input
                  label="Company Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
            {role === 'faculty' && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}
            {role === 'institution' && (
              <>
                <Input
                  label="Institution Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Input
                  label="Departments (comma separated)"
                  name="departments"
                  value={formData.departments}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g., CSE, ECE, Mechanical"
                />
              </>
            )}
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Register
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
