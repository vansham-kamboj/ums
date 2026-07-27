import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState(localStorage.getItem('currentTeam'));

  // Hydrate user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { /* ignore parse errors */ }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (email, password) => {
    email = email.trim().toLowerCase();
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    if (userData.teams?.length > 0) {
      const defaultTeam = userData.teams.find(t => t.isDefault) || userData.teams[0];
      localStorage.setItem('currentTeam', defaultTeam.teamId);
      setCurrentTeam(defaultTeam.teamId);
    }
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore logout errors */ }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentTeam');
    setToken(null);
    setUser(null);
    setCurrentTeam(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch {
      return null;
    }
  }, []);

  const switchTeam = useCallback((teamId) => {
    localStorage.setItem('currentTeam', teamId);
    setCurrentTeam(teamId);
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.scope === 'ADMIN') return true;
    if (user.permissions instanceof Set) return user.permissions.has(permission);
    if (Array.isArray(user.permissions)) return user.permissions.includes(permission);
    return false;
  }, [user]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (Array.isArray(user.roles)) return user.roles.includes(role);
    return false;
  }, [user]);

  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    currentTeam,
    login,
    register,
    logout,
    refreshProfile,
    switchTeam,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
