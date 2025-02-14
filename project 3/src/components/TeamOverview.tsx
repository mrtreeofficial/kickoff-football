import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, Award, ArrowLeft, Loader2 } from 'lucide-react';
import { db } from '../lib/db';

interface PlayerStat {
  id: string;
  player: {
    full_name: string;
  };
  goals: number;
  assists: number;
  games_played: number;
  yellow_cards: number;
  red_cards: number;
}

interface TeamDetails {
  id: string;
  name: string;
  crest?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  division: number;
  location: string;
  game_day: string;
}

const TeamOverview = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!id) return;

      try {
        // Fetch team details
        const teamResult = await db.execute<TeamDetails>({
          sql: 'SELECT * FROM teams WHERE id = ?',
          args: [id]
        });

        if (teamResult.rows.length === 0) {
          throw new Error('Team not found');
        }

        setTeam(teamResult.rows[0]);

        // Fetch player stats
        const statsResult = await db.execute<PlayerStat>({
          sql: 'SELECT * FROM player_stats WHERE team_id = ?',
          args: [id]
        });

        setPlayerStats(statsResult.rows);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading team details...</span>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="text-lg mb-4">{error || 'Team not found'}</p>
          <Link
            to="/tables"
            className="text-emerald-600 dark:text-emerald-500 hover:underline"
          >
            Return to League Tables
          </Link>
        </div>
      </div>
    );
  }

  const topScorer = playerStats.reduce((prev, current) => 
    (current.goals > (prev?.goals || 0)) ? current : prev
  , null);

  const topAssister = playerStats.reduce((prev, current) => 
    (current.assists > (prev?.assists || 0)) ? current : prev
  , null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          to="/tables"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to League Tables
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Team Overview */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              {team.crest && (
                <img
                  src={team.crest}
                  alt={`${team.name} crest`}
                  className="w-20 h-20"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold dark:text-white">{team.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Division {team.division} - {team.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {team.game_day} League
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">Games Played</div>
                <div className="text-2xl font-bold dark:text-white">{team.played}</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <div className="text-sm text-emerald-600 dark:text-emerald-400">Points</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{team.points}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Goals For</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{team.goals_for}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="text-sm text-red-600 dark:text-red-400">Goals Against</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{team.goals_against}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Top Performers</h2>
            {topScorer && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="text-yellow-500" size={20} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Top Scorer</span>
                </div>
                <div className="font-semibold dark:text-white">{topScorer.player.full_name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{topScorer.goals} goals</div>
              </div>
            )}
            {topAssister && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Top Assister</span>
                </div>
                <div className="font-semibold dark:text-white">{topAssister.player.full_name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{topAssister.assists} assists</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Stats Table */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold dark:text-white">Player Statistics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Games
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Goals
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assists
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {playerStats.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium dark:text-white">{player.player.full_name}</div>
                    </td>
                    <td className="px-6 py-4 text-center dark:text-gray-300">
                      {player.games_played}
                    </td>
                    <td className="px-6 py-4 text-center dark:text-gray-300">
                      {player.goals}
                    </td>
                    <td className="px-6 py-4 text-center dark:text-gray-300">
                      {player.assists}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {player.yellow_cards > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                            {player.yellow_cards}
                          </span>
                        )}
                        {player.red_cards > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                            {player.red_cards}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;