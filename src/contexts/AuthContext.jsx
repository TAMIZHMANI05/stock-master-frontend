import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { API_CONFIG } from '../config/api';

const AuthContext = createContext(undefined);

// Role constants
export const ROLES = {
  INVENTORY_MANAGER: 'inventory_manager',
  WAREHOUSE_STAFF: 'warehouse_staff',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Optionally verify token is still valid
      verifyToken();
    } else {
      setIsLoading(false);
    }

    // Listen for login events from LoginPage
    const handleLogin = (event) => {
      const { token, user } = event.detail;
      setToken(token);
      setUser(user);
    };

    window.addEventListener('mock-login', handleLogin);
    return () => window.removeEventListener('mock-login', handleLogin);
  }, []);

  // Verify if the stored token is still valid
  const verifyToken = async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE);
      if (response.data.success) {
        const userData = response.data.data;
        
        // Map backend role to frontend role
        let frontendRole;
        if (userData.role === 'manager') {
          frontendRole = ROLES.INVENTORY_MANAGER;
        } else if (userData.role === 'staff') {
          frontendRole = ROLES.WAREHOUSE_STAFF;
        }

        // Update user data
        const updatedUser = {
          id: userData._id,
          email: userData.email,
          name: userData.name,
          role: frontendRole,
          backendRole: userData.role
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      // Token is invalid, clear everything
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Step 1: Login to get token
      const loginResponse = await apiClient.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        { email, password }
      );

      if (!loginResponse.data.success) {
        throw new Error(loginResponse.data.message || 'Login failed');
      }

      const { token: authToken } = loginResponse.data.data;

      // Store token temporarily
      localStorage.setItem('token', authToken);
      setToken(authToken);

      // Step 2: Get user profile to fetch role
      const profileResponse = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE);

      if (!profileResponse.data.success) {
        throw new Error(profileResponse.data.message || 'Failed to fetch profile');
      }

      const userData = profileResponse.data.data;

      // Map backend role to frontend role
      let frontendRole;
      if (userData.role === 'manager') {
        frontendRole = ROLES.INVENTORY_MANAGER;
      } else if (userData.role === 'staff') {
        frontendRole = ROLES.WAREHOUSE_STAFF;
      } else {
        throw new Error('Invalid user role');
      }

      // Create user object
      const userObj = {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: frontendRole,
        backendRole: userData.role
      };

      // Store user data
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);

      return { success: true, user: userObj, role: frontendRole };
    } catch (error) {
      // Clear any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    verifyToken,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
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
