import React from 'react';

const crests = [
  { id: 'shield-1', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield1&backgroundColor=0c4a6e' },
  { id: 'shield-2', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield2&backgroundColor=1e40af' },
  { id: 'shield-3', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield3&backgroundColor=4c1d95' },
  { id: 'shield-4', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield4&backgroundColor=831843' },
  { id: 'shield-5', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield5&backgroundColor=7c2d12' },
  { id: 'shield-6', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=shield6&backgroundColor=115e59' },
];

interface TeamCrestSelectorProps {
  selectedCrest: string;
  onSelect: (crest: string) => void;
}

const TeamCrestSelector: React.FC<TeamCrestSelectorProps> = ({ selectedCrest, onSelect }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Select Team Crest
      </label>
      <div className="grid grid-cols-3 gap-4">
        {crests.map((crest) => (
          <button
            key={crest.id}
            onClick={() => onSelect(crest.url)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCrest === crest.url
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <img
              src={crest.url}
              alt={`Team crest ${crest.id}`}
              className="w-full h-auto"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamCrestSelector;