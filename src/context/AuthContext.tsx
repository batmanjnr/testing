import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, ViewState, AuthMode, Listing } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  view: ViewState;
  setView: (view: ViewState) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  preselectedRole: UserRole;
  setPreselectedRole: (role: UserRole) => void;
  currentListing: Listing | null;
  setCurrentListing: (listing: Listing | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [preselectedRole, setPreselectedRole] = useState<UserRole>('tenant');
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);

  const login = (role: UserRole, userData?: Partial<User>) => {
    setUser({ 
      id: Math.random().toString(36).substr(2, 9),
      name: userData?.name || (role === 'tenant' ? 'Tenant User' : 'Agent User'), 
      email: userData?.email || 'user@example.com',
      role,
      nin: userData?.nin || '12345678901',
      city: userData?.city || 'Ibadan',
      country: 'Nigeria',
      ...userData
    });
    setView('app');
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => {
    setUser(null);
    setView('landing');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout,
      updateProfile,
      view,
      setView,
      authMode,
      setAuthMode,
      preselectedRole,
      setPreselectedRole,
      currentListing,
      setCurrentListing,
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
