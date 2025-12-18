'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from './AuthLayout';

export default function LoginForm() {
  const [email, setEmail] = useState(''); 
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email); 
    } catch (err: any) {
      setError('Correo no registrado o error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="🔑 Iniciar Sesión"
      footerText="Acceso exclusivo para personal y clientes"
      footerLink="Soporte Técnico"
      footerHref="#"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 italic">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}