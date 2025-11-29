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
      const { data } = await axios.get('/auth/profile');
      setUser(data);
      setMerchantProfile({ business_name: data.businessName });
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMerchantProfile({ business_name: data.user.businessName });
      return { error: null };
    } catch (error) {
      return { error: { message: error.response?.data?.error || 'Login failed' } };
    }
  };

  const signUp = async (email, password, businessName) => {
    try {
      const { data } = await axios.post('/auth/register', { email, password, businessName });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMerchantProfile({ business_name: data.user.businessName });
      return { error: null };
    } catch (error) {
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