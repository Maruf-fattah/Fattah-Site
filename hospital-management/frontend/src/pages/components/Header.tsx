import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../../components/ThemeToggle';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🏥 Hospital Management System
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
