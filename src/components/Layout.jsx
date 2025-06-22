import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 