import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { loginUser } from '../lib/db';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = await loginUser(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
            <Lock size={48} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400
                         text-gray-900 dark:text-white
                         bg-white dark:bg-gray-700
                         focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                         dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                         sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400
                         text-gray-900 dark:text-white
                         bg-white dark:bg-gray-700
                         focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                         dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                         sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-emerald-600 
                       hover:bg-emerald-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-emerald-500
                       dark:focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;