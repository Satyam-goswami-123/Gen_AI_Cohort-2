import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  const [backendUrl] = useState('http://localhost:8000/api');
  const [history, setHistory] = useState([]);
  const [examples, setExamples] = useState([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Apply theme class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch examples from Backend API
  const fetchExamples = async () => {
    setIsLoadingExamples(true);
    try {
      const response = await axios.get(`${backendUrl}/examples`);
      setExamples(response.data.examples || []);
    } catch (error) {
      console.error('Error fetching use-case examples:', error);
    } finally {
      setIsLoadingExamples(false);
    }
  };

  // Fetch analysis history from Backend API
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`${backendUrl}/history`);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchExamples();
    fetchHistory();
  }, [backendUrl]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        backendUrl,
        history,
        fetchHistory,
        examples,
        isLoadingExamples,
        isLoadingHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
