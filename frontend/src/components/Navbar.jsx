import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, BrainCircuit, BarChart3, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-400 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Decision<span className="text-brand-600 dark:text-brand-400">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/')
                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/analyze')
                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
            }`}
          >
            Workspace
          </Link>
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/dashboard')
                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
            }`}
          >
            Dashboard
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Direct Link */}
          <Link
            to="/analyze"
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-brand-700"
          >
            Launch
          </Link>
          
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </nav>
  );
}
