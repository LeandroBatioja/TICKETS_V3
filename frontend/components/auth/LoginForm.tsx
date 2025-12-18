// components/auth/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // 👈 Importante
import AuthLayout from './AuthLayout';

export default function LoginForm() {
  const [email, setEmail] = useState(''); 
  const [error, setError] = useState<string | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  // Extraemos user y loading del contexto global
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  /* ==========================================================
     PROTECCIÓN INVERSA: Si ya está logueado, mandarlo al Inicio
  ========================================================== */
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/'); 
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setLoadingLocal(true);
    try {
      await login(email); 
      // La redirección a '/' ya está dentro de tu login en AuthContext, 
      // pero el useEffect de arriba sirve de respaldo.
    } catch (err: any) {
      setError(err.message || 'Error desconocido al iniciar sesión');
    } finally {
      setLoadingLocal(false);
    }
  };

  // Si el sistema está verificando si hay un usuario en localStorage, 
  // mostramos un estado neutro para evitar que el login parpadee.
  if (authLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="🔑 Iniciar Sesión"
      footerText="¿No tienes cuenta?"
      footerLink="Regístrate"
      footerHref="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-600 mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-slate-800"
            placeholder="Introduce tu email registrado"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loadingLocal}
          className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition disabled:opacity-50 font-bold"
        >
          {loadingLocal ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </AuthLayout>
  );
}