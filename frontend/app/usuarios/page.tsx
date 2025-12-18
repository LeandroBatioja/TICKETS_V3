// app/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUsuarios, updateUsuario } from '@/lib/api';
import { User, UserRole } from '@/types/users';

export default function UsuariosPage() {
  const { role, loading } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    if (role === 'operador') fetchUsuarios();
  }, [role]);

  // 🟢 'id' ahora es de tipo number para evitar el error ts(2345)
  const handleUpdate = async (id: number, updates: any) => {
    try {
      await updateUsuario(id, updates);
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    } catch (err) {
      alert("No se pudo actualizar el usuario");
    }
  };

  if (loading || cargando) return <div className="p-10 text-slate-500 font-bold">Cargando usuarios...</div>;

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Gestión de Usuarios</h1>
        <p className="text-slate-500 mb-8 font-medium italic">Control de roles y accesos del sistema</p>

        <div className="space-y-4">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between px-6 transition-all hover:shadow-md">
              
              {/* Información del Usuario */}
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${u.rol === 'operador' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-400 shadow-slate-100'}`}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-none mb-1">{u.nombre}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{u.rol}</p>
                </div>
              </div>

              {/* Contenedor de Acciones con Expansión */}
              <div className="flex items-center gap-6">
                
                {/* ACCIÓN 1: CAMBIAR ROL */}
                <div className="group relative flex items-center">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 cursor-default shadow-sm border border-indigo-100">
                    🎭
                  </div>
                  <div className="flex items-center opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-500 ease-out">
                    <span className="text-indigo-500 font-bold text-xl mx-2">→</span>
                    <div className="bg-white border border-slate-200 rounded-full px-2 py-1 flex gap-1 shadow-sm">
                      <button 
                        onClick={() => handleUpdate(u.id, { rol: 'cliente' })}
                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full transition ${u.rol === 'cliente' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                      >Cliente</button>
                      <button 
                        onClick={() => handleUpdate(u.id, { rol: 'operador' })}
                        className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full transition ${u.rol === 'operador' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                      >Operador</button>
                    </div>
                  </div>
                </div>

                {/* ACCIÓN 2: ACTIVAR / INACTIVAR */}
                <div className="group relative flex items-center">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 cursor-default border ${(u as any).activo === false ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    {(u as any).activo === false ? '🔴' : '🟢'}
                  </div>
                  <div className="flex items-center opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-500 ease-out">
                    <span className="text-slate-400 font-bold text-xl mx-2">→</span>
                    <button 
                      onClick={() => handleUpdate(u.id, { activo: !(u as any).activo })}
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase border shadow-sm transition-all ${(u as any).activo === false ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
                    >
                      {(u as any).activo === false ? 'Activar cuenta' : 'Suspender acceso'}
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