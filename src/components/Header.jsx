import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/world-bank-logo.png';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLinkClassName = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-200 text-gray-800'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
    }`;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-20 w-auto" src={logo} alt="World Bank" />
              </Link>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={getLinkClassName}>
                  Home
                </NavLink>
                <NavLink to="/repository" className={getLinkClassName}>
                  Repository
                </NavLink>
                <NavLink to="/assistant" className={getLinkClassName}>
                  Assistant
                </NavLink>
                {isAuthenticated && (
                  <NavLink to="/admin" className={getLinkClassName}>
                    Admin
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
          <div className="ml-4 flex items-center">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-indigo-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 