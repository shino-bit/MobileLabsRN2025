import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from './firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userSession');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Помилка читання AsyncStorage", e);
      }
    };
    loadUserFromStorage();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await AsyncStorage.setItem('userSession', JSON.stringify(currentUser));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('userSession');
      }
      setLoading(false);
    });

    return unsubscribe; 
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};