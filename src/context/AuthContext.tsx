import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('linesGenius_token');
      const savedUser = localStorage.getItem('linesGenius_user');
      
      if (savedToken && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('linesGenius_token');
            localStorage.removeItem('linesGenius_user');
          }
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('linesGenius_token');
          localStorage.removeItem('linesGenius_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        setUser(userData);
        localStorage.setItem('linesGenius_token', token);
        localStorage.setItem('linesGenius_user', JSON.stringify(userData));
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register({ name, email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        setUser(userData);
        localStorage.setItem('linesGenius_token', token);
        localStorage.setItem('linesGenius_user', JSON.stringify(userData));
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('linesGenius_token');
    localStorage.removeItem('linesGenius_user');
    localStorage.removeItem('savedLines'); // Clear saved lines on logout
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('linesGenius_user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};