// app/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsuarios, updateUsuario } from '@/lib/api';
import { User } from '@/types/users';

export default function UsuariosPage() {
  const { role, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios de la base de datos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!authLoading && role === 'operador') fetchUsuarios();
  }, [role, authLoading]);

  const handleUpdate = async (id: number, updates: any) => {
    try {
      await updateUsuario(id, updates);
      // Actualización local para que sea instantáneo
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch (err) {
      alert("Error al actualizar en la base de datos");
    }
  };

  if (authLoading || cargando) return <div className="p-10 text-slate-500 font-bold animate-pulse">Consultando base de datos...</div>;

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">👥 Control de Usuarios</h1>
          <p className="text-slate-500 font-medium">Gestiona accesos y roles directamente de la base de datos.</p>
        </header>

        <div className="grid gap-4">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md px-8">
              
              {/* Perfil */}
              <div className="flex items-center gap-5">
                <div className={`h-14 w-14 rounded-3xl flex items-center justify-center font-bold text-white text-xl shadow-lg ${u.rol === 'operador' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-400 shadow-slate-100'}`}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{u.nombre}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{u.rol}</p>
                </div>
              </div>

              {/* Botones con Expansión */}
              <div className="flex items-center gap-6">
                
                {/* ACCIÓN: CAMBIAR ROL */}
                <div className="group relative flex items-center">
                  <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-indigo-100">
                    🎭
                  </div>
                  <div className="flex items-center opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-500 ease-out ml-2">
                    <span className="text-indigo-500 font-bold text-xl mr-3">→</span>
                    <div className="bg-slate-50 border border-slate-200 rounded-full p-1 flex gap-1 shadow-inner">
                      <button onClick={() => handleUpdate(u.id, { rol: 'cliente' })} className={`text-[10px] font-black uppercase px-4 py-2 rounded-full transition ${u.rol === 'cliente' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}>Cliente</button>
                      <button onClick={() => handleUpdate(u.id, { rol: 'operador' })} className={`text-[10px] font-black uppercase px-4 py-2 rounded-full transition ${u.rol === 'operador' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}>Operador</button>
                    </div>
                  </div>
                </div>

                {/* ACCIÓN: ESTADO CUENTA */}
                <div className="group relative flex items-center">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border shadow-sm ${u.activo === false ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    {u.activo === false ? '🔴' : '🟢'}
                  </div>
                  <div className="flex items-center opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-500 ease-out ml-2">
                    <span className="text-slate-400 font-bold text-xl mr-3">→</span>
                    <button 
                      onClick={() => handleUpdate(u.id, { activo: !u.activo })}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-md transition-all ${u.activo === false ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}
                    >
                      {u.activo === false ? 'Activar acceso' : 'Suspender'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}