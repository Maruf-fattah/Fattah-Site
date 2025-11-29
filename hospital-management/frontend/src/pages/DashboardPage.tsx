import React from 'react';
import { useAuthCheck } from '../hooks/useAuth';
import { Layout, Card } from '../components';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const DashboardPage: React.FC = () => {
  const { user } = useAuthCheck();

  return (
    <Layout
      sidebar={<Sidebar />}
      header={<Header />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Patients" className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2,453</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Active patients</p>
        </Card>

        <Card title="Appointments Today" className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">24</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Scheduled</p>
        </Card>

        <Card title="Pending Tests" className="text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">12</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Lab tests</p>
        </Card>

        <Card title="Revenue Today" className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹45,230</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Total billing</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Appointments" className="lg:col-span-2">
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Dashboard content will be loaded here
            </p>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              New Patient
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              Schedule Appointment
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              Create Prescription
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
