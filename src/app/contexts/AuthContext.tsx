import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
  trialEndsAt?: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getAuthHeader: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a single Supabase client instance outside the component
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e73d1e02`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sprawdź czy użytkownik jest zalogowany przy starcie
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        // Ustawiamy podstawowe dane użytkownika z metadanych
        const userData = data.session.user.user_metadata;
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: userData.name || '',
          role: userData.role || '',
        });
      }
    } catch (error) {
      console.error('Check session error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Błąd rejestracji' };
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Błąd połączenia z serwerem' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Błąd logowania' };
      }

      setSession(data.session);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'Błąd połączenia z serwerem' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const getAuthHeader = () => {
    if (!session?.access_token) {
      console.warn('No session access token available');
      return '';
    }
    return `Bearer ${session.access_token}`;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, getAuthHeader }}>
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