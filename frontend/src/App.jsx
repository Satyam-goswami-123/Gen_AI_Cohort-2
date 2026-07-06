import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200/60 dark:border-slate-850 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-semibold">
                DecisionAI – Community Decision Intelligence Platform
              </p>
              <p className="mt-1.5 font-mono text-[10px]">
                Built for Better Living and Smarter Communities • Hackathon MVP
              </p>
            </div>
          </footer>

        </div>
      </Router>
    </AppProvider>
  );
}
