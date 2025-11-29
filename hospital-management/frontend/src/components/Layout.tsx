import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {sidebar && (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {header && (
          <header className="bg-white dark:bg-gray-800 shadow">
            {header}
          </header>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
