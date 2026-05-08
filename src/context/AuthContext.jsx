import React, { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          await fetchProfile(data.user.id);
        }
      } catch (err) {
        setDebugMsg('Auth Check Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    try {
      setDebugMsg('Fetching profile for ' + userId);
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (error) {
        setDebugMsg('DB Error: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        setProfile(data[0]);
        setDebugMsg('Profile Loaded: ' + data[0].username);
      } else {
        setDebugMsg('Profile missing. Attempting auto-create...');
        const { data: userDetails } = await insforge.auth.getCurrentUser();
        const email = userDetails?.user?.email || '';
        const username = email.split('@')[0] || 'Guest';
        
        const { data: newProfile, error: insError } = await insforge.database
          .from('profiles')
          .upsert([{ id: userId, username, email }], { onConflict: 'id' })
          .select()
          .single();
        
        if (newProfile) {
          setProfile(newProfile);
          setDebugMsg('Profile Auto-Created: ' + newProfile.username);
        } else {
          setDebugMsg('Creation Failed: ' + (insError?.message || 'Unknown'));
        }
      }
    } catch (err) {
      setDebugMsg('Critical Error: ' + err.message);
    }
  };

  const signup = async (email, password, username) => {
    const { data, error } = await insforge.auth.signUp({ email, password, name: username });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
      await insforge.database.from('profiles').upsert([{ id: data.user.id, username, email }]);
      await fetchProfile(data.user.id);
    }
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
    return data;
  };

  const logout = async () => {
    await insforge.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, fetchProfile, debugMsg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
