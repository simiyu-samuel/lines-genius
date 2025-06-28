import React, { createContext, useContext, useState, useEffect } from 'react';
import { linesAPI } from '../services/apiService';
import { useAuth } from './AuthContext';

export interface SavedLine {
  id: string;
  text: string;
  category: string;
  tone: string;
  tags?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SavedLinesContextType {
  savedLines: SavedLine[];
  isLoading: boolean;
  saveLine: (line: Omit<SavedLine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteLine: (id: string) => Promise<void>;
  clearAllLines: () => Promise<void>;
  refreshSavedLines: () => Promise<void>;
  searchLines: (query: string) => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
}

const SavedLinesContext = createContext<SavedLinesContextType | undefined>(undefined);

export const SavedLinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedLines, setSavedLines] = useState<SavedLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load saved lines when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshSavedLines();
    } else {
      setSavedLines([]);
    }
  }, [isAuthenticated]);

  const refreshSavedLines = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await linesAPI.getSaved();
      if (response.success && response.data?.savedLines) {
        setSavedLines(response.data.savedLines);
      }
    } catch (error) {
      console.error('Failed to load saved lines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLine = async (line: Omit<SavedLine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to save lines');
    }

    try {
      const response = await linesAPI.save(line);
      if (response.success && response.data?.savedLine) {
        setSavedLines(prev => [response.data.savedLine, ...prev]);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to save line');
    }
  };

  const deleteLine = async (id: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await linesAPI.deleteSaved(id);
      if (response.success) {
        setSavedLines(prev => prev.filter(line => line.id !== id));
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete line');
    }
  };

  const clearAllLines = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await linesAPI.clearAllSaved();
      if (response.success) {
        setSavedLines([]);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear lines');
    }
  };

  const searchLines = async (query: string) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await linesAPI.getSaved({ search: query });
      if (response.success && response.data?.savedLines) {
        setSavedLines(response.data.savedLines);
      }
    } catch (error) {
      console.error('Failed to search lines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = async (category: string) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await linesAPI.getSaved({ 
        category: category === 'all' ? undefined : category 
      });
      if (response.success && response.data?.savedLines) {
        setSavedLines(response.data.savedLines);
      }
    } catch (error) {
      console.error('Failed to filter lines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SavedLinesContext.Provider value={{
      savedLines,
      isLoading,
      saveLine,
      deleteLine,
      clearAllLines,
      refreshSavedLines,
      searchLines,
      filterByCategory
    }}>
      {children}
    </SavedLinesContext.Provider>
  );
};

export const useSavedLines = () => {
  const context = useContext(SavedLinesContext);
  if (context === undefined) {
    throw new Error('useSavedLines must be used within a SavedLinesProvider');
  }
  return context;
};