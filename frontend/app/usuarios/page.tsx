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
        setUsuarios(data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      } finally {
        setCargando(false);
      }
    };
    if (!authLoading && role === 'operador') cargar();
  }, [role, authLoading]);

  if (authLoading || cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">👥 Lista de Usuarios</h1>
        <p className="text-slate-500 font-medium">Directorio de personal y clientes registrados.</p>
      </header>

      <div className="grid gap-4">
        {usuarios.map((u) => (
          <div 
            key={u.id} 
            className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between px-8 transition-transform hover:scale-[1.01]"
          >
            {/* Información del Usuario */}
            <div className="flex items-center gap-5">
              {/* Avatar con inicial */}
              <div className={`h-14 w-14 rounded-3xl flex items-center justify-center font-bold text-white text-xl shadow-lg ${u.rol === 'operador' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-400 shadow-slate-100'}`}>
                {u.nombre.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{u.nombre}</h3>
                <p className="text-sm text-slate-400 font-medium">{u.email}</p>
              </div>
            </div>

            {/* Badge de Rol (Solo lectura) */}
            <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              u.rol === 'operador' 
                ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              {u.rol}
            </div>
          </div>
        ))}

        {usuarios.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No hay usuarios registrados en la base de datos.</p>
          </div>
        )}
      </div>
    </main>
  );
}