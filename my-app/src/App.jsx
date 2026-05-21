import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NGOsPage from './pages/NGOsPage';
import HealthcarePage from './pages/HealthcarePage';
import LegalPage from './pages/LegalPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route wrapper
// authLoading is true while AppContext is verifying the JWT cookie with Flask.
// We render nothing until the check completes to prevent a false /login redirect.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useApp();
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ fontSize: '2rem' }}>💜</span>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Inner layout that uses hooks (must be inside BrowserRouter)
const AppLayoutWrapper = () => {
  const { darkMode } = useApp();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/ngos" element={<ProtectedRoute><NGOsPage /></ProtectedRoute>} />
        <Route path="/healthcare" element={<ProtectedRoute><HealthcarePage /></ProtectedRoute>} />
        <Route path="/legal" element={<ProtectedRoute><LegalPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayoutWrapper />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
