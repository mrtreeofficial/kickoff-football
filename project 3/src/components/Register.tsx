import React, { useState, useEffect } from 'react';
import { Send, MapPin, Calendar, Users, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { isAuthenticated } from '../lib/auth';

type RegistrationType = 'team' | 'individual';

const Register = () => {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<RegistrationType>('team');
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    email: '',
    phone: '',
    location: '',
    gameDay: '',
    players: ['', '', '', '', '', '', '']
  });

  const [individualData, setIndividualData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    gameDay: '',
    experience: '',
    preferredPosition: '',
    availability: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        navigate('/player-login');
      }
    };
    checkAuth();
  }, [navigate]);

  const locations = [
    'Willen Lake, Kick Off Sports Centre',
    'Newport Pagnell Town Football Club'
  ];

  const gameDays = ['Monday', 'Wednesday'];
  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Any'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (registrationType === 'team') {
        await db.execute({
          sql: `
            INSERT INTO registrations (
              id, team_name, captain_name, email, phone, location, game_day, players, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            crypto.randomUUID(),
            formData.teamName,
            formData.captainName,
            formData.email,
            formData.phone,
            formData.location,
            formData.gameDay,
            JSON.stringify(formData.players.filter(p => p)),
            'pending'
          ]
        });

        setFormData({
          teamName: '',
          captainName: '',
          email: '',
          phone: '',
          location: '',
          gameDay: '',
          players: ['', '', '', '', '', '', '']
        });
      } else {
        await db.execute({
          sql: `
            INSERT INTO individual_registrations (
              id, name, email, phone, location, game_day, experience, preferred_position, availability, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            crypto.randomUUID(),
            individualData.name,
            individualData.email,
            individualData.phone,
            individualData.location,
            individualData.gameDay,
            individualData.experience,
            individualData.preferredPosition,
            individualData.availability,
            'pending'
          ]
        });

        setIndividualData({
          name: '',
          email: '',
          phone: '',
          location: '',
          gameDay: '',
          experience: '',
          preferredPosition: '',
          availability: ''
        });
      }

      alert('Registration submitted successfully!');
    } catch (err) {
      console.error('Error submitting registration:', err);
      alert('Failed to submit registration. Please try again.');
    }
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = value;
    setFormData({ ...formData, players: newPlayers });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Register</h2>

      {/* Registration Type Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8 transition-colors">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setRegistrationType('team')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors
              ${registrationType === 'team'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            <Users size={20} />
            <span>Register Team</span>
          </button>
          <button
            onClick={() => setRegistrationType('individual')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors
              ${registrationType === 'individual'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            <UserPlus size={20} />
            <span>Join a Team</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <div className="space-y-6">
          {registrationType === 'team' ? (
            // Team Registration Form
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600
                           focus:border-emerald-500 dark:focus:border-emerald-600"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      Preferred Location
                    </span>
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Preferred Game Day
                    </span>
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={formData.gameDay}
                    onChange={(e) => setFormData({ ...formData, gameDay: e.target.value })}
                  >
                    <option value="">Select day</option>
                    {gameDays.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Captain's Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.captainName}
                  onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Players</label>
                <div className="space-y-4">
                  {/* Main Squad (First 5 players) */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 dark:text-gray-200">Main Squad (Required)</h4>
                    {formData.players.slice(0, 5).map((player, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          required
                          placeholder={`Player ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={player}
                          onChange={(e) => handlePlayerChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Substitutes (Last 2 players) */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 dark:text-gray-200">Substitutes (Optional)</h4>
                    {formData.players.slice(5).map((player, index) => (
                      <div key={index + 5}>
                        <input
                          type="text"
                          placeholder={`Substitute ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                   bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                          value={player}
                          onChange={(e) => handlePlayerChange(index + 5, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Individual Player Registration Form
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600
                           focus:border-emerald-500 dark:focus:border-emerald-600"
                  value={individualData.name}
                  onChange={(e) => setIndividualData({ ...individualData, name: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={individualData.email}
                    onChange={(e) => setIndividualData({ ...individualData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={individualData.phone}
                    onChange={(e) => setIndividualData({ ...individualData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      Preferred Location
                    </span>
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={individualData.location}
                    onChange={(e) => setIndividualData({ ...individualData, location: e.target.value })}
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Preferred Game Day
                    </span>
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={individualData.gameDay}
                    onChange={(e) => setIndividualData({ ...individualData, gameDay: e.target.value })}
                  >
                    <option value="">Select day</option>
                    {gameDays.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Football Experience
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600
                           focus:border-emerald-500 dark:focus:border-emerald-600"
                  rows={3}
                  placeholder="Tell us about your football experience..."
                  value={individualData.experience}
                  onChange={(e) => setIndividualData({ ...individualData, experience: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Preferred Position
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={individualData.preferredPosition}
                  onChange={(e) => setIndividualData({ ...individualData, preferredPosition: e.target.value })}
                >
                  <option value="">Select position</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Availability
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                  placeholder="Any specific availability or restrictions we should know about?"
                  value={individualData.availability}
                  onChange={(e) => setIndividualData({ ...individualData, availability: e.target.value })}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-md font-semibold 
                     flex items-center justify-center space-x-2 
                     hover:bg-emerald-700 transition-colors"
          >
            <span>Submit Registration</span>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;