'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/users';
import { getUsuarioActual, loginUser } from '@/lib/api'; 
import { useRouter } from 'next/navigation'; 

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  const loadUser = useCallback(async () => {
    try {
      const savedEmail = localStorage.getItem('user_email');
      
      if (!savedEmail) {
        setLoading(false); // 👈 Desbloquea la app si no hay sesión
        return;
      }
      
      const currentUser = await getUsuarioActual(savedEmail);
      setUser(currentUser);
      setRole(currentUser.rol);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      localStorage.removeItem('user_email');
    } finally {
      setLoading(false); // 👈 Garantiza que loading termine siempre
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const loggedUser = await loginUser(email); 
      localStorage.setItem('user_email', email);
      setUser(loggedUser);
      setRole(loggedUser.rol);
      router.push('/'); 
    } catch (error) {
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_email');
    setUser(null);
    setRole(null);
    router.replace('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}