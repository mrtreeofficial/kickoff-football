import React, { useState, useEffect } from 'react';
import { Trophy, Edit2, Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { isAdmin } from '../lib/auth';

type TeamStats = {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  division: 1 | 2;
  location: string;
  game_day: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const locations = [
    'Willen Lake, Kick Off Sports Centre',
    'Newport Pagnell Town Football Club'
  ];

  const gameDays = ['Monday', 'Wednesday'];

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<1 | 2>(1);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthAndFetchTeams = async () => {
      try {
        const adminCheck = await isAdmin();
        if (!adminCheck) {
          navigate('/login');
          return;
        }

        const result = await db.execute('SELECT * FROM teams ORDER BY points DESC');
        setTeams(result.rows);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchTeams();
  }, [navigate]);

  const [editForm, setEditForm] = useState<Partial<TeamStats>>({});
  const [newTeam, setNewTeam] = useState<Partial<TeamStats>>({
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    goal_difference: 0,
    points: 0,
  });

  const filteredTeams = teams.filter(team => 
    (!selectedLocation || team.location === selectedLocation) && 
    (!selectedDay || team.game_day === selectedDay) &&
    team.division === selectedDivision
  );

  const handleEdit = (team: TeamStats) => {
    setEditingTeam(team.id);
    setEditForm(team);
  };

  const handleSave = async (id: string) => {
    try {
      const updatedTeam = {
        ...editForm,
        goal_difference: (editForm.goals_for || 0) - (editForm.goals_against || 0),
        points: ((editForm.won || 0) * 3) + (editForm.drawn || 0)
      };

      await db.execute({
        sql: `
          UPDATE teams 
          SET name = ?, played = ?, won = ?, drawn = ?, lost = ?,
              goals_for = ?, goals_against = ?, goal_difference = ?, points = ?
          WHERE id = ?
        `,
        args: [
          updatedTeam.name,
          updatedTeam.played,
          updatedTeam.won,
          updatedTeam.drawn,
          updatedTeam.lost,
          updatedTeam.goals_for,
          updatedTeam.goals_against,
          updatedTeam.goal_difference,
          updatedTeam.points,
          id
        ]
      });

      setTeams(teams.map(team => 
        team.id === id ? { ...team, ...updatedTeam } : team
      ));
      
      setEditingTeam(null);
      setEditForm({});
    } catch (err) {
      console.error('Error updating team:', err);
      setError('Failed to update team');
    }
  };

  const handleCancel = () => {
    setEditingTeam(null);
    setEditForm({});
  };

  const handleInputChange = (field: keyof TeamStats, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'goals_for' || field === 'goals_against' ? {
        goal_difference: field === 'goals_for' 
          ? Number(value) - (prev.goals_against || 0)
          : (prev.goals_for || 0) - Number(value)
      } : {}),
      ...(field === 'won' || field === 'drawn' ? {
        points: (field === 'won' ? Number(value) * 3 : (prev.won || 0) * 3) + 
                (field === 'drawn' ? Number(value) : (prev.drawn || 0))
      } : {})
    }));
  };

  const handleNewTeamChange = (field: keyof TeamStats, value: string | number) => {
    setNewTeam(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'goals_for' || field === 'goals_against' ? {
        goal_difference: field === 'goals_for' 
          ? Number(value) - (prev.goals_against || 0)
          : (prev.goals_for || 0) - Number(value)
      } : {}),
      ...(field === 'won' || field === 'drawn' ? {
        points: (field === 'won' ? Number(value) * 3 : (prev.won || 0) * 3) + 
                (field === 'drawn' ? Number(value) : (prev.drawn || 0))
      } : {})
    }));
  };

  const handleAddTeam = async () => {
    if (!selectedLocation || !selectedDay) {
      alert('Please select a location and game day first');
      return;
    }

    try {
      const team = {
        id: crypto.randomUUID(),
        name: newTeam.name || '',
        played: newTeam.played || 0,
        won: newTeam.won || 0,
        drawn: newTeam.drawn || 0,
        lost: newTeam.lost || 0,
        goals_for: newTeam.goals_for || 0,
        goals_against: newTeam.goals_against || 0,
        goal_difference: (newTeam.goals_for || 0) - (newTeam.goals_against || 0),
        points: ((newTeam.won || 0) * 3) + (newTeam.drawn || 0),
        division: selectedDivision,
        location: selectedLocation,
        game_day: selectedDay
      };

      await db.execute({
        sql: `
          INSERT INTO teams (
            id, name, played, won, drawn, lost,
            goals_for, goals_against, goal_difference, points,
            division, location, game_day
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          team.id,
          team.name,
          team.played,
          team.won,
          team.drawn,
          team.lost,
          team.goals_for,
          team.goals_against,
          team.goal_difference,
          team.points,
          team.division,
          team.location,
          team.game_day
        ]
      });

      setTeams([...teams, team]);
      setNewTeam({
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        points: 0,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding team:', err);
      setError('Failed to add team');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      await db.execute({
        sql: 'DELETE FROM teams WHERE id = ?',
        args: [id]
      });
      setTeams(teams.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting team:', err);
      setError('Failed to delete team');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          <h2 className="text-3xl font-bold dark:text-white">Team Management</h2>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                   px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Location
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Game Day
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select day</option>
              {gameDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Division
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(Number(e.target.value) as 1 | 2)}
            >
              <option value={1}>Division 1</option>
              <option value={2}>Division 2</option>
            </select>
          </div>
        </div>
      </div>

      {selectedLocation && selectedDay && (
        <>
          <div className="mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 
                       transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Team</span>
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.name || ''}
                    onChange={(e) => handleNewTeamChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Played
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.played || 0}
                    onChange={(e) => handleNewTeamChange('played', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Won
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.won || 0}
                    onChange={(e) => handleNewTeamChange('won', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Drawn
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.drawn || 0}
                    onChange={(e) => handleNewTeamChange('drawn', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Lost
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.lost || 0}
                    onChange={(e) => handleNewTeamChange('lost', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Goals For
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.goals_for || 0}
                    onChange={(e) => handleNewTeamChange('goals_for', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Goals Against
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={newTeam.goals_against || 0}
                    onChange={(e) => handleNewTeamChange('goals_against', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           hover:bg-gray-50 dark:hover:bg-gray-700 
                           text-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeam}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Add Team
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-600 dark:bg-emerald-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-4 py-3 text-center">GF</th>
                    <th className="px-4 py-3 text-center">GA</th>
                    <th className="px-4 py-3 text-center">GD</th>
                    <th className="px-4 py-3 text-center">Pts</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTeams.map(team => (
                    <tr key={team.id} className="dark:text-gray-200">
                      {editingTeam === team.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.name || ''}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.played || ''}
                              onChange={(e) => handleInputChange('played', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.won || ''}
                              onChange={(e) => handleInputChange('won', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.drawn || ''}
                              onChange={(e) => handleInputChange('drawn', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.lost || ''}
                              onChange={(e) => handleInputChange('lost', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.goals_for || ''}
                              onChange={(e) => handleInputChange('goals_for', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              value={editForm.goals_against || ''}
                              onChange={(e) => handleInputChange('goals_against', Number(e.target.value))}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(editForm.goals_for || 0) - (editForm.goals_against || 0)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {((editForm.won || 0) * 3) + (editForm.drawn || 0)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleSave(team.id)}
                                className="p-1 text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1 text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{team.name}</td>
                          <td className="px-4 py-3 text-center">{team.played}</td>
                          <td className="px-4 py-3 text-center">{team.won}</td>
                          <td className="px-4 py-3 text-center">{team.drawn}</td>
                          <td className="px-4 py-3 text-center">{team.lost}</td>
                          <td className="px-4 py-3 text-center">{team.goals_for}</td>
                          <td className="px-4 py-3 text-center">{team.goals_against}</td>
                          <td className="px-4 py-3 text-center">{team.goal_difference}</td>
                          <td className="px-4 py-3 text-center font-bold">{team.points}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEdit(team)}
                                className="p-1 text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(team.id)}
                                className="p-1 text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;