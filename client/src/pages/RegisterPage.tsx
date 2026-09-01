import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState('student');
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
    companyName: '',
    industry: '',
    location: '',
    designation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildProfileData = () => {
    switch (role) {
      case 'student':
        return { name: formData.name, enrollmentNumber: formData.enrollmentNumber, department: formData.department, year: parseInt(formData.year) || 1, education: [] };
      case 'recruiter':
      case 'industry':
        return { companyName: formData.companyName, industry: formData.industry, location: formData.location };
      case 'faculty':
        return { name: formData.name, department: formData.department, designation: formData.designation };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email: formData.email, password: formData.password, role, profileData: buildProfileData() });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'recruiter', label: 'Recruiter / Industry' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'institution', label: 'Institution' },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card>
        <CardHeader><CardTitle className="text-center">Create Account</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-danger-bg text-danger p-3 rounded-lg text-sm">{error}</div>}
            <Select label="I am a" options={roleOptions} value={role} onChange={(e) => setRole(e.target.value)} fullWidth />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} fullWidth required />
            {role === 'student' && (
              <>
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                <Input label="Enrollment Number" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} fullWidth required />
                <Input label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth required />
                <Input label="Year (1-5)" type="number" name="year" value={formData.year} onChange={handleChange} fullWidth required />
              </>
            )}
            {(role === 'recruiter' || role === 'industry') && (
              <>
                <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth required />
                <Input label="Industry" name="industry" value={formData.industry} onChange={handleChange} fullWidth required />
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth required />
              </>
            )}
            {role === 'faculty' && (
              <>
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                <Input label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth required />
                <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} fullWidth required />
              </>
            )}
            <Button type="submit" fullWidth size="lg" loading={loading}>Create Account</Button>
          </form>
          <div className="mt-4 text-center text-body-sm text-muted">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};