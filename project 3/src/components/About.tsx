import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 dark:text-white">About Kick Off Football League</h2>
          <div className="space-y-4 dark:text-gray-300">
            <p>
              Welcome to Kick Off Football League, launching in April 2025. We're bringing an exciting
              new format of 5-a-side football to passionate players in the area.
            </p>
            <p>
              Our league features:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>40-minute matches</li>
              <li>Professional referees</li>
              <li>State-of-the-art facilities</li>
              <li>Weekly fixtures</li>
              <li>League tables and statistics</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6 dark:text-white">Contact Information</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4 transition-colors">
            <div className="flex items-center space-x-3">
              <MapPin className="text-emerald-600 dark:text-emerald-500" />
              <span className="dark:text-gray-200">Milton Keynes</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-emerald-600 dark:text-emerald-500" />
              <span className="dark:text-gray-200">info@kickofffootball.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-emerald-600 dark:text-emerald-500" />
              <span className="dark:text-gray-200">+44 7484 020007</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;