import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, type LoginCredentials, type User } from '@/lib/api/auth';
import { toast } from 'sonner';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(authService.getAccessToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token and fetch user on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const currentToken = authService.getAccessToken();
      if (currentToken) {
        const isValid = await authService.verifyToken();
        if (isValid) {
          // Fetch user data
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.log('Failed to fetch user data:', error);
          }
        } else {
          // Try to refresh the token
          try {
            const newToken = await authService.refreshAccessToken();
            setToken(newToken);
            // Try to fetch user data with new token
            try {
              const userData = await authService.getCurrentUser();
              setUser(userData);
            } catch (error) {
              console.log('Failed to fetch user data after refresh:', error);
            }
          } catch {
            authService.logout();
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.access);
      
      // Fetch user data after successful login
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log('Failed to fetch user data after login:', error);
      }
      
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid credentials');
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authService.refreshAccessToken();
      setToken(newToken);
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
      refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};