import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80"
            alt="Football field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Kick Off Football League</h1>
            <p className="text-xl mb-8">Join the most exciting 5-a-side football league starting April 2025</p>
            <Link
              to="/register"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Register Your Team
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <Calendar className="w-12 h-12 text-emerald-600 dark:text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">League Start</h3>
            <p className="dark:text-gray-300">Kicking off in April 2025</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <Users className="w-12 h-12 text-emerald-600 dark:text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Team Size</h3>
            <p className="dark:text-gray-300">5-a-side teams +2 Subs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <Clock className="w-12 h-12 text-emerald-600 dark:text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Match Duration</h3>
            <p className="dark:text-gray-300">40-minute matches</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;