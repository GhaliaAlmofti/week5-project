import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser } from '../services/api';


interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;


  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('userToken');
    if (storedUser && storedToken) {
      setUser({ ...JSON.parse(storedUser), token: storedToken });
    }
  }, []);


  const login = useCallback(async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password);
      
 
      localStorage.setItem('userToken', userData.token);
      const userWithoutToken = { ...userData, token: undefined };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutToken));
      setUser(userData);
      
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }, []);


  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};