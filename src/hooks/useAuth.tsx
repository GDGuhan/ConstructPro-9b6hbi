import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '@/types';
import { getCurrentUser, login as storageLogin, logout as storageLogout } from '@/lib/storage';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore session on mount
    const saved = getCurrentUser();
    if (saved) setCurrentUser(saved);
  }, []);

  const login = useCallback((email: string, password: string): User | null => {
    const user = storageLogin(email, password);
    if (user) setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    storageLogout();
    setCurrentUser(null);
  }, []);

  const hasRole = useCallback((...roles: Role[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
