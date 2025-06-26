import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SavedLine {
  id: string;
  text: string;
  category: string;
  tone: string;
  timestamp: number;
  tags?: string[];
}

interface SavedLinesContextType {
  savedLines: SavedLine[];
  saveLine: (line: Omit<SavedLine, 'id' | 'timestamp'>) => void;
  deleteLine: (id: string) => void;
  clearAllLines: () => void;
}

const SavedLinesContext = createContext<SavedLinesContextType | undefined>(undefined);

export const SavedLinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedLines, setSavedLines] = useState<SavedLine[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedLines');
    if (saved) {
      setSavedLines(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedLines', JSON.stringify(savedLines));
  }, [savedLines]);

  const saveLine = (line: Omit<SavedLine, 'id' | 'timestamp'>) => {
    const newLine: SavedLine = {
      ...line,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setSavedLines(prev => [newLine, ...prev]);
  };

  const deleteLine = (id: string) => {
    setSavedLines(prev => prev.filter(line => line.id !== id));
  };

  const clearAllLines = () => {
    setSavedLines([]);
  };

  return (
    <SavedLinesContext.Provider value={{ savedLines, saveLine, deleteLine, clearAllLines }}>
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