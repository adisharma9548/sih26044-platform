import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" fullWidth size="lg">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};