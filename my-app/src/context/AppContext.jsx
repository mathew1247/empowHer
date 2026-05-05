import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('empowher-darkmode');
    if (stored) setDarkMode(JSON.parse(stored));

    const storedAuth = localStorage.getItem('empowher-auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(authData.isAuthenticated);
      setCurrentUser(authData.user);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('empowher-darkmode', JSON.stringify(next));
      return next;
    });
  };

  const login = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('empowher-auth', JSON.stringify({ isAuthenticated: true, user }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('empowher-auth');
  };

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, isAuthenticated, currentUser, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
