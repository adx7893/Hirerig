
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import { api } from '../services/laravelApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('hire_rig_user');

      if (token) {
        try {
          // Attempt to fetch fresh user data from Laravel
          const userData = await api.get('/user');
          setUser(userData);
          localStorage.setItem('hire_rig_user', JSON.stringify(userData));
        } catch (error) {
          // Fallback to local storage if API fails or offline
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } else if (savedUser) {
        // Fallback for demo purposes if only user object exists
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, role: UserRole, password = 'password') => {
    setIsLoading(true);
    
    try {
      // 1. Attempt Real Laravel Login
      // Expected Laravel Response: { token: '...', user: { ... } }
      const response = await api.post('/login', { email, password, role });
      
      const { token, user: apiUser } = response;
      
      if (token) localStorage.setItem('auth_token', token);
      
      // Ensure the user object has necessary UI properties
      const fullUser = {
        ...apiUser,
        role: role, // Enforce selected role for UI logic
        avatar: apiUser.avatar || `https://picsum.photos/seed/${email}/200`,
        connections: apiUser.connections || [],
        following: apiUser.following || [],
        followers: apiUser.followers || []
      };

      setUser(fullUser);
      localStorage.setItem('hire_rig_user', JSON.stringify(fullUser));

    } catch (error) {
      console.warn("Backend connection failed, using Mock Data for demo:", error);

      // 2. Fallback to Mock Data (for demo/development without backend)
      const found = MOCK_USERS.find(u => u.email === email);
      if (found) {
        setUser(found as any);
        localStorage.setItem('hire_rig_user', JSON.stringify(found));
        // We set a fake token to simulate logged in state
        localStorage.setItem('auth_token', 'mock_token_123');
      } else {
        // Create a temporary mock user
        const tempUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role,
          avatar: `https://picsum.photos/seed/${email}/200`,
          headline: role === UserRole.CANDIDATE ? 'Open to Work' : 'Recruiting for Tech',
          connections: [],
          following: [],
          followers: []
        };
        setUser(tempUser);
        localStorage.setItem('hire_rig_user', JSON.stringify(tempUser));
        localStorage.setItem('auth_token', 'mock_token_123');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout', {});
    } catch (e) {
      // Ignore error if logout fails (e.g. server down)
    }
    setUser(null);
    localStorage.removeItem('hire_rig_user');
    localStorage.removeItem('auth_token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('hire_rig_user', JSON.stringify(updated));
      
      // Attempt to sync with backend in background
      api.put(`/user/${user.id}`, data).catch(err => console.warn("Failed to sync profile update", err));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
