import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    enrollmentNumber: '',
    department: '',
    year: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { role, ...formData });
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
            <Select
              label="I am a"
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            {role === 'student' && (
              <>
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
            <Button type="submit" fullWidth size="lg">
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