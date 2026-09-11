import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'BUSINESS_ADMIN' | 'PLATFORM_ADMIN';
  businessId: string | null;
  businessName?: string | null;
  businessSlug?: string | null;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  role: AuthUser['role'] | 'GUEST';
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
  updateUserBusiness: (businessId: string, businessName?: string, businessSlug?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    const token = getAuthToken();
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    const res = await api.getMe();
    if (res.success && res.data) {
      setCurrentUser({
        id: res.data.id,
        email: res.data.email,
        fullName: res.data.full_name || 'User',
        role: res.data.role as any || 'BUSINESS_ADMIN',
        businessId: res.data.business_id || null,
        businessName: res.data.business_name || null,
        businessSlug: res.data.business_slug || null,
      });
    } else {
      setAuthToken(null);
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.success && res.data) {
      setAuthToken(res.data.access_token);
      const userObj: AuthUser = {
        id: res.data.id,
        email: res.data.email,
        fullName: res.data.full_name,
        role: (res.data.role as any) || 'BUSINESS_ADMIN',
        businessId: res.data.business_id || null,
        businessName: res.data.business_name || null,
        businessSlug: res.data.business_slug || null,
      };
      setCurrentUser(userObj);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to sign in' };
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await api.register(fullName, email, password);
    if (res.success && res.data) {
      setAuthToken(res.data.access_token);
      const userObj: AuthUser = {
        id: res.data.id,
        email: res.data.email,
        fullName: res.data.full_name,
        role: (res.data.role as any) || 'BUSINESS_ADMIN',
        businessId: null,
      };
      setCurrentUser(userObj);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to register' };
  };

  const signOut = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  const updateUserBusiness = (businessId: string, businessName?: string, businessSlug?: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        businessId,
        businessName: businessName || currentUser.businessName,
        businessSlug: businessSlug || currentUser.businessSlug,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : 'GUEST',
        isAuthenticated: !!currentUser,
        isLoading,
        signIn,
        register,
        signOut,
        refreshSession,
        updateUserBusiness,
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
