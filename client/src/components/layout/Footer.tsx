import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-custom py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SIH26044 — Portal for Academia–Industry Collaboration. Built with ❤️ for Smart India Hackathon.
      </div>
    </footer>
  );
};  