import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../utils/axios';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isLoading: boolean;
  username: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isLoading: true,
  username: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');

    if (accessToken) {
      axios
        .get('/api/auth/status/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          
        })
        .then((res) => {
          if (res.data.isAuthenticated) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch((err) => {
          console.error('Auth check failed:', err);
          setIsLoggedIn(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading,  username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
