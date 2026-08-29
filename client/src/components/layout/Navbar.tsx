import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const isLoggedIn = false; // will be replaced later

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">SIH26044</span>
        </Link>
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700">User Name</span>
              <Button variant="outline" size="sm">Logout</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};