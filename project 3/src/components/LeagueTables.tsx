import React, { useState } from 'react';
import { Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

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
  crest?: string;
};

const mockTeams: Record<string, Record<string, Record<1 | 2, TeamStats[]>>> = {
  'Willen Lake, Kick Off Sports Centre': {
    'Monday': {
      1: [
        {
          id: '1',
          name: 'Red Dragons FC',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 15,
          goals_against: 5,
          goal_difference: 10,
          points: 13,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=dragon&backgroundColor=dc2626'
        },
        {
          id: '2',
          name: 'Blue Lightning',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 12,
          goals_against: 7,
          goal_difference: 5,
          points: 10,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=lightning&backgroundColor=2563eb'
        },
        {
          id: '3',
          name: 'Phoenix United',
          played: 5,
          won: 2,
          drawn: 2,
          lost: 1,
          goals_for: 8,
          goals_against: 6,
          goal_difference: 2,
          points: 8,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=phoenix&backgroundColor=ea580c'
        },
        {
          id: '4',
          name: 'Green Rovers',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 10,
          goals_against: 8,
          goal_difference: 2,
          points: 10,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=rover&backgroundColor=16a34a'
        },
        {
          id: '5',
          name: 'Purple Panthers',
          played: 5,
          won: 2,
          drawn: 2,
          lost: 1,
          goals_for: 9,
          goals_against: 8,
          goal_difference: 1,
          points: 8,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=panther&backgroundColor=7e22ce'
        },
        {
          id: '6',
          name: 'Golden Eagles',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 14,
          goals_against: 6,
          goal_difference: 8,
          points: 12,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=eagle&backgroundColor=ca8a04'
        }
      ],
      2: [
        {
          id: '7',
          name: 'Silver Sharks',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=shark&backgroundColor=64748b'
        },
        {
          id: '8',
          name: 'Royal Lions',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 16,
          goals_against: 4,
          goal_difference: 12,
          points: 13,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=lion&backgroundColor=b91c1c'
        },
        {
          id: '9',
          name: 'Sapphire Stars',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 12,
          goals_against: 8,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=star&backgroundColor=1d4ed8'
        },
        {
          id: '10',
          name: 'Thunder Knights',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 15,
          goals_against: 5,
          goal_difference: 10,
          points: 12,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=knight&backgroundColor=4338ca'
        },
        {
          id: '11',
          name: 'Crimson Cobras',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=cobra&backgroundColor=991b1b'
        },
        {
          id: '12',
          name: 'Emerald Titans',
          played: 5,
          won: 3,
          drawn: 2,
          lost: 0,
          goals_for: 12,
          goals_against: 6,
          goal_difference: 6,
          points: 11,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=titan&backgroundColor=059669'
        }
      ]
    },
    'Wednesday': {
      1: [
        {
          id: '13',
          name: 'Sapphire Spartans',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=spartan&backgroundColor=2563eb'
        },
        {
          id: '14',
          name: 'Golden Griffins',
          played: 5,
          won: 2,
          drawn: 2,
          lost: 1,
          goals_for: 9,
          goals_against: 8,
          goal_difference: 1,
          points: 8,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=griffin&backgroundColor=ca8a04'
        },
        {
          id: '15',
          name: 'Ruby Raiders',
          played: 5,
          won: 1,
          drawn: 1,
          lost: 3,
          goals_for: 7,
          goals_against: 11,
          goal_difference: -4,
          points: 4,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=raider&backgroundColor=dc2626'
        },
        {
          id: '16',
          name: 'Obsidian Oracles',
          played: 5,
          won: 0,
          drawn: 1,
          lost: 4,
          goals_for: 4,
          goals_against: 13,
          goal_difference: -9,
          points: 1,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=oracle&backgroundColor=1e293b'
        },
        {
          id: '17',
          name: 'Azure Avalanche',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 15,
          goals_against: 5,
          goal_difference: 10,
          points: 13,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=avalanche&backgroundColor=2563eb'
        },
        {
          id: '18',
          name: 'Crimson Cyclones',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 13,
          goals_against: 6,
          goal_difference: 7,
          points: 12,
          division: 1,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=cyclone&backgroundColor=dc2626'
        }
      ],
      2: [
        {
          id: '19',
          name: 'Emerald Eagles',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=eagle2&backgroundColor=059669'
        },
        {
          id: '20',
          name: 'Topaz Tigers',
          played: 5,
          won: 2,
          drawn: 1,
          lost: 2,
          goals_for: 8,
          goals_against: 9,
          goal_difference: -1,
          points: 7,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=tiger2&backgroundColor=b45309'
        },
        {
          id: '21',
          name: 'Amethyst Arrows',
          played: 5,
          won: 1,
          drawn: 1,
          lost: 3,
          goals_for: 6,
          goals_against: 11,
          goal_difference: -5,
          points: 4,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=arrow2&backgroundColor=7e22ce'
        },
        {
          id: '22',
          name: 'Pearl Pirates',
          played: 5,
          won: 0,
          drawn: 2,
          lost: 3,
          goals_for: 5,
          goals_against: 12,
          goal_difference: -7,
          points: 2,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=pirate2&backgroundColor=64748b'
        },
        {
          id: '23',
          name: 'Onyx Outlaws',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 16,
          goals_against: 4,
          goal_difference: 12,
          points: 13,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=outlaw&backgroundColor=1e293b'
        },
        {
          id: '24',
          name: 'Platinum Phoenixes',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 14,
          goals_against: 6,
          goal_difference: 8,
          points: 12,
          division: 2,
          location: 'Willen Lake, Kick Off Sports Centre',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=phoenix2&backgroundColor=64748b'
        }
      ]
    }
  },
  'Newport Pagnell Town Football Club': {
    'Monday': {
      1: [
        {
          id: '25',
          name: 'Amber Assassins',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 12,
          goals_against: 7,
          goal_difference: 5,
          points: 10,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=assassin&backgroundColor=d97706'
        },
        {
          id: '26',
          name: 'Emerald Titans',
          played: 5,
          won: 3,
          drawn: 2,
          lost: 0,
          goals_for: 12,
          goals_against: 6,
          goal_difference: 6,
          points: 11,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=titan&backgroundColor=059669'
        },
        {
          id: '27',
          name: 'Sapphire Spartans',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=spartan&backgroundColor=2563eb'
        },
        {
          id: '28',
          name: 'Golden Griffins',
          played: 5,
          won: 2,
          drawn: 2,
          lost: 1,
          goals_for: 9,
          goals_against: 8,
          goal_difference: 1,
          points: 8,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=griffin&backgroundColor=ca8a04'
        },
        {
          id: '29',
          name: 'Ruby Raiders',
          played: 5,
          won: 1,
          drawn: 1,
          lost: 3,
          goals_for: 7,
          goals_against: 11,
          goal_difference: -4,
          points: 4,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=raider&backgroundColor=dc2626'
        },
        {
          id: '30',
          name: 'Obsidian Oracles',
          played: 5,
          won: 0,
          drawn: 1,
          lost: 4,
          goals_for: 4,
          goals_against: 13,
          goal_difference: -9,
          points: 1,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=oracle&backgroundColor=1e293b'
        }
      ],
      2: [
        {
          id: '31',
          name: 'Azure Avalanche',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 15,
          goals_against: 5,
          goal_difference: 10,
          points: 13,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=avalanche&backgroundColor=2563eb'
        },
        {
          id: '32',
          name: 'Crimson Cyclones',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 13,
          goals_against: 6,
          goal_difference: 7,
          points: 12,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=cyclone&backgroundColor=dc2626'
        },
        {
          id: '33',
          name: 'Emerald Eagles',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=eagle2&backgroundColor=059669'
        },
        {
          id: '34',
          name: 'Topaz Tigers',
          played: 5,
          won: 2,
          drawn: 1,
          lost: 2,
          goals_for: 8,
          goals_against: 9,
          goal_difference: -1,
          points: 7,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=tiger2&backgroundColor=b45309'
        },
        {
          id: '35',
          name: 'Amethyst Arrows',
          played: 5,
          won: 1,
          drawn: 1,
          lost: 3,
          goals_for: 6,
          goals_against: 11,
          goal_difference: -5,
          points: 4,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=arrow2&backgroundColor=7e22ce'
        },
        {
          id: '36',
          name: 'Pearl Pirates',
          played: 5,
          won: 0,
          drawn: 2,
          lost: 3,
          goals_for: 5,
          goals_against: 12,
          goal_difference: -7,
          points: 2,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Monday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=pirate2&backgroundColor=64748b'
        }
      ]
    },
    'Wednesday': {
      1: [
        {
          id: '37',
          name: 'Onyx Outlaws',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 16,
          goals_against: 4,
          goal_difference: 12,
          points: 13,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=outlaw&backgroundColor=1e293b'
        },
        {
          id: '38',
          name: 'Platinum Phoenixes',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 14,
          goals_against: 6,
          goal_difference: 8,
          points: 12,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=phoenix2&backgroundColor=64748b'
        },
        {
          id: '39',
          name: 'Amber Assassins',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 12,
          goals_against: 7,
          goal_difference: 5,
          points: 10,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=assassin&backgroundColor=d97706'
        },
        {
          id: '40',
          name: 'Cobalt Crusaders',
          played: 5,
          won: 2,
          drawn: 1,
          lost: 2,
          goals_for: 9,
          goals_against: 8,
          goal_difference: 1,
          points: 7,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=crusader2&backgroundColor=1d4ed8'
        },
        {
          id: '41',
          name: 'Violet Vikings',
          played: 5,
          won: 1,
          drawn: 0,
          lost: 4,
          goals_for: 6,
          goals_against: 13,
          goal_difference: -7,
          points: 3,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=viking&backgroundColor=7c3aed'
        },
        {
          id: '42',
          name: 'Bronze Bears',
          played: 5,
          won: 0,
          drawn: 1,
          lost: 4,
          goals_for: 4,
          goals_against: 14,
          goal_difference: -10,
          points: 1,
          division: 1,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=bear&backgroundColor=92400e'
        }
      ],
      2: [
        {
          id: '43',
          name: 'Jade Jaguars',
          played: 5,
          won: 4,
          drawn: 1,
          lost: 0,
          goals_for: 15,
          goals_against: 5,
          goal_difference: 10,
          points: 13,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=jaguar&backgroundColor=059669'
        },
        {
          id: '44',
          name: 'Ruby Renegades',
          played: 5,
          won: 4,
          drawn: 0,
          lost: 1,
          goals_for: 13,
          goals_against: 6,
          goal_difference: 7,
          points: 12,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=renegade&backgroundColor=dc2626'
        },
        {
          id: '45',
          name: 'Sapphire Scorpions',
          played: 5,
          won: 3,
          drawn: 1,
          lost: 1,
          goals_for: 11,
          goals_against: 7,
          goal_difference: 4,
          points: 10,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=scorpion&backgroundColor=2563eb'
        },
        {
          id: '46',
          name: 'Topaz Titans',
          played: 5,
          won: 2,
          drawn: 1,
          lost: 2,
          goals_for: 8,
          goals_against: 9,
          goal_difference: -1,
          points: 7,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=titan2&backgroundColor=b45309'
        },
        {
          id: '47',
          name: 'Amethyst Angels',
          played: 5,
          won: 1,
          drawn: 1,
          lost: 3,
          goals_for: 6,
          goals_against: 11,
          goal_difference: -5,
          points: 4,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=angel&backgroundColor=7e22ce'
        },
        {
          id: '48',
          name: 'Pearl Panthers',
          played: 5,
          won: 0,
          drawn: 2,
          lost: 3,
          goals_for: 5,
          goals_against: 12,
          goal_difference: -7,
          points: 2,
          division: 2,
          location: 'Newport Pagnell Town Football Club',
          game_day: 'Wednesday',
          crest: 'https://api.dicebear.com/7.x/shapes/svg?seed=panther2&backgroundColor=64748b'
        }
      ]
    }
  }
};

const LeagueTables = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const day = searchParams.get('day');

  const locations = [
    'Willen Lake, Kick Off Sports Centre',
    'Newport Pagnell Town Football Club'
  ];

  const gameDays = ['Monday', 'Wednesday'];

  const [sortConfig, setSortConfig] = useState<{
    key: keyof TeamStats;
    direction: 'ascending' | 'descending';
  }>({
    key: 'points',
    direction: 'descending'
  });

  const getTeams = (division: 1 | 2) => {
    if (!location || !day) return [];
    return mockTeams[location]?.[day]?.[division] || [];
  };

  const sortTeams = (teams: TeamStats[], key: keyof TeamStats) => {
    let direction: 'ascending' | 'descending' = 'descending';
    
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }

    const sortedTeams = [...teams].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1 ;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    return sortedTeams;
  };

  const SortableHeader = ({ label, field }: { label: string; field: keyof TeamStats }) => (
    <th 
      className="px-4 py-3 cursor-pointer hover:bg-emerald-700 transition-colors"
      onClick={() => sortTeams(getTeams(1), field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown size={16} />
      </div>
    </th>
  );

  const LeagueTable = ({ division }: { division: 1 | 2 }) => {
    const teams = getTeams(division);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 transition-colors">
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-3">
          <h3 className="text-xl font-bold">Division {division}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-100 dark:bg-emerald-900/50">
              <tr>
                <th className="px-4 py-3 text-left dark:text-white">Pos</th>
                <th className="px-4 py-3 text-left dark:text-white">Team</th>
                <SortableHeader label="P" field="played" />
                <SortableHeader label="W" field="won" />
                <SortableHeader label="D" field="drawn" />
                <SortableHeader label="L" field="lost" />
                <SortableHeader label="GF" field="goals_for" />
                <SortableHeader label="GA" field="goals_against" />
                <SortableHeader label="GD" field="goal_difference" />
                <SortableHeader label="Pts" field="points" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teams.map((team, index) => (
                <tr 
                  key={team.id}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                    ${division === 1 && index >= 4 ? 'bg-red-50 dark:bg-red-900/20' : ''}
                    ${division === 2 && index <= 1 ? 'bg-green-50 dark:bg-green-900/20' : ''}
                  `}
                >
                  <td className="px-4 py-3 dark:text-gray-200">
                    <div className="flex items-center space-x-1">
                      <span>{index + 1}</span>
                      {division === 1 && index >= 4 && <ArrowDown className="text-red-500" size={16} />}
                      {division === 2 && index <= 1 && <ArrowUp className="text-green-500" size={16} />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium dark:text-white">
                    <Link
                      to={`/teams/${team.id}`}
                      className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      {team.crest && (
                        <img src={team.crest} alt={`${team.name} crest`} className="w-6 h-6" />
                      )}
                      <span>{team.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.played}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.won}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.drawn}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.lost}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.goals_for}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.goals_against}</td>
                  <td className="px-4 py-3 text-center dark:text-gray-200">{team.goal_difference}</td>
                  <td className="px-4 py-3 text-center font-bold dark:text-white">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!location || !day) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          <h2 className="text-3xl font-bold dark:text-white">League Tables</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map(loc => (
            <div key={loc} className="space-y-4">
              <h3 className="text-xl font-bold dark:text-white">{loc}</h3>
              <div className="grid gap-4">
                {gameDays.map(gameDay => (
                  <Link
                    key={gameDay}
                    to={`/tables?location=${encodeURIComponent(loc)}&day=${gameDay}`}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <h4 className="text-lg font-semibold mb-2 dark:text-white">{gameDay} League</h4>
                    <p className="text-gray-600 dark:text-gray-300">View standings for {gameDay} games at {loc.split(',')[0]}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
          <div>
            <h2 className="text-3xl font-bold dark:text-white">{location.split(',')[0]}</h2>
            <p className="text-gray-600 dark:text-gray-400">{day} League</p>
          </div>
        </div>
        <Link
          to="/tables"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Back to All Leagues
        </Link>
      </div>

      <LeagueTable division={1} />
      <LeagueTable division={2} />

      <div className="grid md:grid-cols-2 gap-8 mt-6 text-sm">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors">
          <h4 className="font-bold mb-2 dark:text-white">Key:</h4>
          <ul className="space-y-1 dark:text-gray-300">
            <li>Pos = Position</li>
            <li>P = Played</li>
            <li>W = Won</li>
            <li>D = Drawn</li>
            <li>L = Lost</li>
            <li>GF = Goals For</li>
            <li>GA = Goals Against</li>
            <li>GD = Goal Difference</li>
            <li>Pts = Points</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors">
          <h4 className="font-bold mb-2 dark:text-white">Promotion & Relegation:</h4>
          <ul className="space-y-2 dark:text-gray-300">
            <li className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"></div>
              <span>Relegation zone (Division 1)</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800"></div>
              <span>Promotion zone (Division 2)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeagueTables;