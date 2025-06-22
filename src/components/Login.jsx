import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">Admin Access</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <button 
                    type="submit"
                    className="w-full bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors"
                >
                    Log In as Admin
                </button>
            </form>
            <div className="text-center mt-4">
                <Link to="/" className="text-sm text-indigo-500 hover:underline">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    </div>
  );
} 