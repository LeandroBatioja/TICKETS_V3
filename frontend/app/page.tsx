// app/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardStats from '@/components/DashboardStats';
import { useEffect, useState } from 'react';
import { getTickets } from '@/lib/api';
import { Ticket } from '@/types/ticket';

export default function Page() {
  const { user, role, loading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const cargarResumen = async () => {
      const userId = user?.id || (user as any)?.id_usuario;
      if (userId && role) {
        const data = await getTickets(userId, role);
        setTickets(data);
      }
    };
    if (user) cargarResumen();
  }, [user, role]);

  if (loading || !user) return null;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">🏠 Inicio</h1>
      <p className="text-slate-500 mb-8 font-medium">
        Bienvenido de nuevo, <span className="text-indigo-600">{user.nombre}</span>.
      </p>

      {/* Solo mostramos las estadísticas aquí */}
      <DashboardStats tickets={tickets} />

      <div className="mt-8 p-10 bg-white rounded-3xl border border-slate-200 text-center">
        <h2 className="text-xl font-bold text-slate-700">Acceso Rápido</h2>
        <p className="text-slate-500 mb-6">¿Qué deseas hacer hoy?</p>
        <div className="flex justify-center gap-4">
          <a href="/tickets" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            Ver mis Tickets
          </a>
        </div>
      </div>
    </main>
  );
}