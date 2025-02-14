import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tally1 as Ball, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-emerald-700 text-white'
          : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-emerald-600 dark:bg-emerald-700 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover:opacity-80 transition-opacity"
          >
            <div className="relative flex items-center justify-center w-10 h-10">
              <Ball 
                size={28} 
                className="transform group-hover:rotate-180 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm -z-10"></div>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Kick Off Football
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tables">League Tables</NavLink>
            <NavLink to="/register">Register Team</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/player-login">Player Login</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-50 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden absolute w-full bg-emerald-600 dark:bg-emerald-700 shadow-lg transition-colors`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/tables"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/tables')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            League Tables
          </Link>
          <Link
            to="/register"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/register')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Register Team
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/about')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/player-login"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/player-login')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Player Login
          </Link>
          <Link
            to="/admin"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/admin')
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white'
                : 'text-emerald-50 hover:bg-emerald-700/50 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;