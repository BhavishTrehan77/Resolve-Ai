import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { decodeToken, isTokenExpired } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state on page load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !isTokenExpired(storedToken)) {
        const decoded = decodeToken(storedToken);
        if (decoded?.id) {
          try {
            // Attempt to refresh user data from database
            const userData = await userService.getUserById(decoded.id);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (err) {
            // If API fails, fall back to decoded info
            if (!user) {
              setUser({ id: decoded.id, role: decoded.role });
            }
          }
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const jwtToken = response.data?.AccToken || response.data?.token;

    if (!jwtToken) {
      throw new Error('No token returned from server');
    }

    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);

    const decoded = decodeToken(jwtToken);
    let userData = response.data?.user || { id: decoded?.id, role: decoded?.role };

    try {
      if (!userData.name && decoded?.id) {
        const fullProfile = await userService.getUserById(decoded.id);
        if (fullProfile) {
          userData = fullProfile;
        }
      }
    } catch {
      // Fallback to token payload
    }

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Signup handler
  const signup = async (name, email, password, role = 'EMPLOYEE') => {
    const response = await authService.signup(name, email, password, role);
    const jwtToken = response.data?.assToken || response.data?.token;
    const newUser = response.data?.user || { name, email, role };

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }

    return response;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from './useAuth';
