"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserProfile {
  address: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  joinedDate: string;
  preferences: {
    emailNotifications: boolean;
    campaignUpdates: boolean;
  };
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load profile when component mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!updates.address) return;

    const newProfile: UserProfile = {
      address: updates.address,
      displayName: updates.displayName || `User ${updates.address.slice(0, 6)}`,
      bio: updates.bio || "",
      avatar: updates.avatar || "",
      joinedDate: updates.joinedDate || new Date().toISOString(),
      preferences: {
        emailNotifications: updates.preferences?.emailNotifications ?? true,
        campaignUpdates: updates.preferences?.campaignUpdates ?? true,
        ...updates.preferences,
      },
      ...updates,
    };

    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('userProfile');
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
