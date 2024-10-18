"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../lib/axiosInstance'; // Import the Axios instance

interface User {
  username: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null; // Add error state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Initialize error state
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      console.log("Login attempt with username:", username);
      console.log("Login attempt with password:", password);

      const response = await axiosInstance.post('Identity/Login', {
        username,
        password,
      });

      if (response.status === 204) {
        const userData = response.data;
        setUser(userData || { username });
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login errors:', error);
      setError('Login failed. Please check your credentials.'); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    try {
      await axiosInstance.post('Identity/logout'); // Ensure your API clears cookies
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/login');
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