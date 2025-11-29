import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">HMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          📊 Dashboard
        </Link>
        <Link
          to="/patients"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          👥 Patients
        </Link>
        <Link
          to="/appointments"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          📅 Appointments
        </Link>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          📋 Medical Records
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          💊 Prescriptions
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          🧪 Lab Tests
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          💰 Billing
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
