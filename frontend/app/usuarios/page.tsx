// app/usuarios/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsuariosPage() {
  const { role, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== 'operador') {
      router.replace('/'); // Si no es operador, lo sacamos de aquí
    }
  }, [role, loading, router]);

  if (loading || role !== 'operador') return null;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-slate-800">👥 Gestión de Usuarios</h1>
      <p className="text-slate-500 mt-2">Aquí aparecerá la lista de clientes registrados en el sistema.</p>
      
      {/* Aquí podrás mapear una lista de usuarios de tu BD más adelante */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 text-slate-400 italic">
        Funcionalidad de administración en desarrollo...
      </div>
    </main>
  );
}