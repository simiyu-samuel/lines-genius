import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('linesGenius_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would validate against backend
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        joinedAt: Date.now(),
      };
      
      setUser(mockUser);
      localStorage.setItem('linesGenius_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    if (email && password.length >= 6 && name) {
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        joinedAt: Date.now(),
      };
      
      setUser(mockUser);
      localStorage.setItem('linesGenius_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid registration data');
    }
    
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('linesGenius_user');
    localStorage.removeItem('savedLines'); // Clear saved lines on logout
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user
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