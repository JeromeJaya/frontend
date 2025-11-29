import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading profile...');
      const { data } = await axios.get('/auth/profile');
      console.log('Profile loaded:', data);
      setUser(data);
      setMerchantProfile({ business_name: data.businessName });
    } catch (error) {
      console.error('Profile load error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const { data } = await axios.post('/auth/login', { email, password });
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMerchantProfile({ business_name: data.user.businessName });
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: error.response?.data?.error || 'Login failed' } };
    }
  };

  const signUp = async (email, password, businessName) => {
    try {
      console.log('Attempting registration with:', { email, password, businessName });
      const { data } = await axios.post('/auth/register', { email, password, businessName });
      console.log('Registration successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMerchantProfile({ business_name: data.user.businessName });
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: { message: error.response?.data?.error || 'Registration failed' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setMerchantProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, merchantProfile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}