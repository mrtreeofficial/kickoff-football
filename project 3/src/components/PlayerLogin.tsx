import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, Lock, User, Calendar, Phone, Heart } from 'lucide-react';
import { createUser, loginUser } from '../lib/db';
import { db } from '../lib/db';

const PlayerLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserTeam = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const user = await verifyToken(token);
        if (user) {
          const team = await db.getUserTeam(user.id);
          if (team) {
            navigate(`/teams/${team.id}`);
          } else {
            navigate('/register');
          }
        }
      } catch (err) {
        console.error('Error checking user team:', err);
      }
    };

    checkUserTeam();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Validate date of birth
        const dob = new Date(formData.dateOfBirth);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 16) {
          throw new Error('Players must be at least 16 years old');
        }

        // Validate emergency contact
        if (!formData.emergencyContact.name || !formData.emergencyContact.phone || !formData.emergencyContact.relationship) {
          throw new Error('All emergency contact fields are required');
        }

        const token = await createUser(
          formData.email,
          formData.password,
          formData.fullName,
          formData.dateOfBirth,
          formData.emergencyContact
        );
        
        localStorage.setItem('token', token);
        localStorage.setItem('playerAuthenticated', 'true');
        navigate('/register');
      } else {
        const token = await loginUser(formData.email, formData.password);
        localStorage.setItem('token', token);
        localStorage.setItem('playerAuthenticated', 'true');
        navigate('/register');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
            <UserCircle size={48} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignUp ? 'Create Player Account' : 'Player Login'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                               border border-gray-300 dark:border-gray-600 
                               placeholder-gray-500 dark:placeholder-gray-400
                               text-gray-900 dark:text-white
                               bg-white dark:bg-gray-700
                               focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                               dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                               sm:text-sm"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="dateOfBirth"
                      type="date"
                      required
                      className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                               border border-gray-300 dark:border-gray-600 
                               text-gray-900 dark:text-white
                               bg-white dark:bg-gray-700
                               focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                               dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                               sm:text-sm"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Emergency Contact
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Name
                    </label>
                    <input
                      name="emergency.name"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 
                               border border-gray-300 dark:border-gray-600 
                               text-gray-900 dark:text-white
                               bg-white dark:bg-gray-700
                               focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                               dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                               sm:text-sm"
                      placeholder="Emergency contact name"
                      value={formData.emergencyContact.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relationship
                    </label>
                    <input
                      name="emergency.relationship"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 
                               border border-gray-300 dark:border-gray-600 
                               text-gray-900 dark:text-white
                               bg-white dark:bg-gray-700
                               focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                               dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                               sm:text-sm"
                      placeholder="e.g., Parent, Spouse, Sibling"
                      value={formData.emergencyContact.relationship}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="emergency.phone"
                        type="tel"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                                 border border-gray-300 dark:border-gray-600 
                                 text-gray-900 dark:text-white
                                 bg-white dark:bg-gray-700
                                 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                                 dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                                 sm:text-sm"
                        placeholder="Emergency contact phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="emergency.email"
                        type="email"
                        className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                                 border border-gray-300 dark:border-gray-600 
                                 text-gray-900 dark:text-white
                                 bg-white dark:bg-gray-700
                                 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                                 dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                                 sm:text-sm"
                        placeholder="Emergency contact email"
                        value={formData.emergencyContact.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                           border border-gray-300 dark:border-gray-600 
                           text-gray-900 dark:text-white
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                           dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                           sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                           border border-gray-300 dark:border-gray-600 
                           text-gray-900 dark:text-white
                           bg-white dark:bg-gray-700
                           focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                           dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                           sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 
                             border border-gray-300 dark:border-gray-600 
                             text-gray-900 dark:text-white
                             bg-white dark:bg-gray-700
                             focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                             dark:focus:ring-emerald-600 dark:focus:border-emerald-600
                             sm:text-sm"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
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
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  fullName: '',
                  dateOfBirth: '',
                  emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: '',
                    email: ''
                  }
                });
                setError('');
              }}
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerLogin;