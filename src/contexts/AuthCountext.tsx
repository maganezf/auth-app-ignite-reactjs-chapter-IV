import Router from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from 'services/api';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type UserResponseData = {
  email: string;
  password: string;
  token: string;
  refreshToken: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<null | User>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'auth-app.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post<Partial<UserResponseData>>('sessions', {
        email,
        password,
      });

      console.log('response.data', response.data);

      const { roles, permissions, token, refreshToken } = response.data;

      setCookie(undefined, 'auth-app.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, 'auth-app.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuthContext must be used within a AuthProvider');

  return context;
}
