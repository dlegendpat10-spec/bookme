import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../mock/initialData';

interface AuthContextType {
  currentUser: User | null;
  role: User['role'] | 'GUEST';
  isAuthenticated: boolean;
  signInAs: (userId: string) => void;
  signOut: () => void;
  setRole: (role: User['role']) => void;
  usersList: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Returning Customer (Alex Morgan) so the ultra-fast 5-second flow is immediately testable!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bookme_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[2]; // Alex Morgan
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bookme_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bookme_current_user');
    }
  }, [currentUser]);

  const signInAs = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  const setRole = (role: User['role']) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : 'GUEST',
        isAuthenticated: !!currentUser,
        signInAs,
        signOut,
        setRole,
        usersList: INITIAL_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
