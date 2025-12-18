// app/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsuarios } from '@/lib/api';
import { User } from '@/types/users';

export default function UsuariosPage() {
  const { role, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      // Solo cargamos si el usuario es operador
      if (role === 'operador') {
        const data = await getUsuarios();
        console.log("Usuarios cargados en el componente:", data);
        setUsuarios(data);
      }
      setCargando(false);
    };
    if (!authLoading) cargar();
  }, [role, authLoading]);

  const totalOperadores = usuarios.filter(u => u.rol?.toLowerCase() === 'operador').length;
  const totalClientes = usuarios.filter(u => u.rol?.toLowerCase() === 'cliente').length;

  if (authLoading || cargando) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-bold animate-pulse">Conectando con la base de datos...</p>
      </div>
    );
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Directorio</h1>
          <p className="text-slate-500 font-medium">Usuarios activos en el sistema</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          title="Refrescar datos"
        >
          🔄
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatBox label="Registrados" value={usuarios.length} color="text-slate-800" />
        <StatBox label="Operadores" value={totalOperadores} color="text-indigo-600" />
        <StatBox label="Clientes" value={totalClientes} color="text-emerald-600" />
      </div>

      {/* LISTA DINÁMICA */}
      <div className="space-y-3">
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <div key={u.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between px-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white ${u.rol?.toLowerCase() === 'operador' ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                  {u.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{u.nombre}</h3>
                  <p className="text-sm text-slate-400">{u.email}</p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${u.rol?.toLowerCase() === 'operador' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                {u.rol}
              </span>
            </div>
          ))
        ) : (
          <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-10 rounded-[2.5rem] text-center">
            <p className="text-amber-700 font-bold">¡Atención!</p>
            <p className="text-amber-600 text-sm">La API respondió correctamente pero la lista está vacía o el Mapper no encontró los campos.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}