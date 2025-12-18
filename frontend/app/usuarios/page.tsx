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
      try {
        const data = await getUsuarios();
        setUsuarios(data || []);
      } catch (err) {
        console.error("Error al obtener usuarios de la DB:", err);
      } finally {
        setCargando(false);
      }
    };
    if (!authLoading && role === 'operador') cargar();
  }, [role, authLoading]);

  // Cálculos dinámicos basados en la base de datos
  const totalOperadores = usuarios.filter(u => u.rol === 'operador').length;
  const totalClientes = usuarios.filter(u => u.rol === 'cliente').length;

  if (authLoading || cargando) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-bold">Consultando base de datos...</p>
      </div>
    );
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">👥 Directorio de Usuarios</h1>
        <p className="text-slate-500 font-medium">Visualización en tiempo real de cuentas registradas.</p>
      </header>

      {/* 1. CONTADORES SUPERIORES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatSmallCard label="Total Usuarios" value={usuarios.length} color="text-slate-800" bg="bg-white" />
        <StatSmallCard label="Operadores" value={totalOperadores} color="text-indigo-600" bg="bg-indigo-50" />
        <StatSmallCard label="Clientes" value={totalClientes} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      {/* 2. LISTA DE USUARIOS DE LA BASE DE DATOS */}
      <div className="grid gap-4">
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <div 
              key={u.id} 
              className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between px-8 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center gap-5">
                {/* Avatar con inicial dinámica */}
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg ${u.rol === 'operador' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-500 shadow-slate-100'}`}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{u.nombre}</h3>
                  <p className="text-sm text-slate-400 font-medium">{u.email}</p>
                </div>
              </div>

              {/* Etiqueta de Rol con estilo diferencial */}
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                u.rol === 'operador' 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500'
              }`}>
                {u.rol}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg">La base de datos está vacía.</p>
            <p className="text-slate-400 text-sm">No se encontraron registros de usuarios.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Componente pequeño para los contadores
function StatSmallCard({ label, value, color, bg }: any) {
  return (
    <div className={`${bg} p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-transform hover:scale-105`}>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}