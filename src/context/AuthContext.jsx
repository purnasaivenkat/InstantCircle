import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial user state
    const checkUser = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          await fetchProfile(data.user.id);
        }
      } catch (err) {
        console.error('Error checking user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const signup = async (email, password, username) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name: username
    });
    
    if (error) throw error;
    
    if (data?.user) {
      setUser(data.user);
      // Create profile record in database
      await insforge.database.from('profiles').insert([{
        id: data.user.id,
        username,
        created_at: new Date().toISOString()
      }]);
      await fetchProfile(data.user.id);
    }
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
    return data;
  };

  const logout = async () => {
    const { error } = await insforge.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signup, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
