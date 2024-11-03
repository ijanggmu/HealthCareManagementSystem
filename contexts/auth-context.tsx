"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../lib/axiosInstance';
import { debug } from 'console';

interface User {
  username: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor for 401 errors
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [router]);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Validate token with backend
          const response = await axiosInstance.post('Identity/RefreshToken');
          if (response.status === 204) {
            setUser(JSON.parse(storedUser));
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [router]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('Identity/Login', {
        username,
        password,
      });

      if (response.status === 204) {
        const token = response.headers['authorization']?.split(' ')[1];
        const userData = { username, token };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('Identity/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axiosInstance.defaults.headers.common['Authorization'];
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
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