/**
 * AppContext.jsx — EmpowHer Global State
 * ========================================
 * Provides authentication state driven by the Flask JWT backend.
 * JWT tokens are stored ONLY in HTTP-only cookies (managed by the browser).
 * This file does NOT use localStorage for auth — only dark-mode preference
 * is stored there (non-sensitive UI setting).
 *
 * Exposed values:
 *   darkMode        {boolean}   — Current dark mode state
 *   toggleDarkMode  {function}  — Toggle dark mode & persist preference
 *   isAuthenticated {boolean}   — Whether user has a valid session
 *   currentUser     {object}    — { id, username, email } or null
 *   login           {function}  — Call Flask /api/auth/login; sets cookie
 *   logout          {function}  — Call Flask /api/auth/logout; clears cookie
 *   checkAuth       {function}  — Call Flask /api/auth/profile to verify session
 *   authLoading     {boolean}   — True while session check is in-flight
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api/auth';

const AppContext = createContext();

// ── Provider ───────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode]           = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser]     = useState(null);
  const [authLoading, setAuthLoading]     = useState(true); // check on mount

  // ── Dark mode — persisted in localStorage (not sensitive) ──────────────────
  useEffect(() => {
    const stored = localStorage.getItem('empowher-darkmode');
    if (stored) setDarkMode(JSON.parse(stored));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('empowher-darkmode', JSON.stringify(next));
      return next;
    });
  };

  // ── checkAuth — verify existing cookie session on app load ─────────────────
  /**
   * Calls the protected /profile endpoint with credentials: "include".
   * If the browser sends a valid JWT cookie, Flask responds with the user.
   * On any error (no cookie, expired, invalid) → clear local auth state.
   */
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        credentials: 'include',   // ← REQUIRED: send HTTP-only cookie cross-origin
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setCurrentUser(data.user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch {
      // Network error or Flask not running — treat as unauthenticated
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Check existing session when the app first mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── login — authenticate via Flask, receive HTTP-only cookie ───────────────
  /**
   * @param {string} email
   * @param {string} password
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // ← allows Flask to set the cookie in the browser
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        return { ok: true, user: data.user };
      }

      return { ok: false, error: data.error || 'Login failed. Please try again.' };
    } catch {
      return { ok: false, error: 'Cannot reach the server. Is Flask running?' };
    }
  };

  // ── logout — clear JWT cookie via Flask ────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',   // ← send cookie so Flask can unset it
      });
    } catch {
      // Even if the request fails, clear local state
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  // ── signup — register new account via Flask ────────────────────────────────
  /**
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  const signup = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        return { ok: true, user: data.user };
      }

      return { ok: false, error: data.error || 'Signup failed. Please try again.' };
    } catch {
      return { ok: false, error: 'Cannot reach the server. Is Flask running?' };
    }
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      isAuthenticated,
      currentUser,
      authLoading,
      login,
      logout,
      signup,
      checkAuth,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
