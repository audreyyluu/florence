"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

type AppState = {
  theme: 'light' | 'dark';
  userPreferences: {
    showNotifications: boolean;
    defaultView: string;
    zoomLevel: number;
  };
  lastViewedRoom?: string;
  filters: {
    selectedRole: string;
    selectedStatus: string;
    selectedCondition: string;
    showUnderstaffed: boolean;
  };
};

type AppStateContextType = {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  updateFilters: (filters: Partial<AppState['filters']>) => void;
};

const defaultState: AppState = {
  theme: 'light',
  userPreferences: {
    showNotifications: true,
    defaultView: 'grid',
    zoomLevel: 1,
  },
  filters: {
    selectedRole: 'all',
    selectedStatus: 'all',
    selectedCondition: 'all',
    showUnderstaffed: false,
  },
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    // Load persisted state from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        try {
          return JSON.parse(savedState);
        } catch (e) {
          console.error('Failed to parse saved state:', e);
        }
      }
    }
    return defaultState;
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const updateUserPreferences = (preferences: Partial<AppState['userPreferences']>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences },
    }));
  };

  const updateFilters = (filters: Partial<AppState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateState, updateUserPreferences, updateFilters }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
} 