import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login with email:', email);
      console.log('📍 Request URL:', '/api/auth/login');
      
      const response = await axios.post('/api/auth/login', { email, password });
      
      console.log('✅ Login response:', response.data);
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set state
      setToken(token);
      setUser(user);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ Login successful for user:', user.email);
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('📋 Error response:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      console.error('📝 Error message:', error.message);
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      console.log('🔄 Attempting registration with:', { name, email, role });
      console.log('📍 Request URL:', '/api/auth/register');
      
      const response = await axios.post('/api/auth/register', { 
        name, 
        email, 
        password,
        role 
      });
      
      console.log('✅ Registration response:', response.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('📋 Error response:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      console.error('📝 Error message:', error.message);
      
      // More detailed error message
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'No response from server. Please check if backend is running on port 8060.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Registration failed';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
