'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser, updateUserProfile, getAllUsers } from '@/lib/storage';
import { MockUser } from '@/lib/mock-data';

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  signup: (userData: Omit<MockUser, 'id' | 'createdAt' | 'avatarUrl' | 'points'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fields: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getAllUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      setCurrentUser(found);
      setUser(found);
      setIsLoading(false);
      return true;
    }

    // If not found in mock users, create demo user with email name
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      name: formattedName || 'Mahasiswa IPB',
      cohort: '2024',
      department: 'Ilmu Komputer',
      isAnonymous: false,
      privacyLevel: 'public',
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      points: 100,
    };

    setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (userData: Omit<MockUser, 'id' | 'createdAt' | 'avatarUrl' | 'points'>): Promise<boolean> => {
    setIsLoading(true);
    const newUser: MockUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      points: 50,
    };

    setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = (fields: Partial<MockUser>) => {
    if (!user) return;
    const updated = updateUserProfile(fields);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
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
