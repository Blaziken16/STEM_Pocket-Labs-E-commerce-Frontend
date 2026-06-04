import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  token: string | null;
  currentUser: User | null;
  setToken: (token: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('toybox_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('toybox_token', token);
    } else {
      localStorage.removeItem('toybox_token');
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, setToken, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
