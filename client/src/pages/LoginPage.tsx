import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardHeader><CardTitle className="text-center">Welcome Back</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-danger-bg text-danger p-3 rounded-lg text-sm">{error}</div>}
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required />
            <Button type="submit" fullWidth size="lg" loading={loading}>Sign In</Button>
          </form>
          <div className="mt-4 text-center text-body-sm text-muted">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};