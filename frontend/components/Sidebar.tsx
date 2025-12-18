'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout, user, loading } = useAuth();

  // 🛑 No mostrar nada si es login o si aún está cargando/no hay usuario
  if (pathname === '/login' || loading || !user) return null;

  const itemClass = (path: string) => {
    const isActive = pathname === path;
    return `group flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col h-screen sticky top-0 z-40">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white text-xl">🎫</div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">TicketApp</h2>
        </div>
        <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
          {role}
        </div>
      </div>

      <nav className="space-y-1.5 flex-grow">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Menú Principal</p>
        <Link href="/" className={itemClass('/')}><span>🏠 Inicio</span></Link>
        <Link href="/tickets" className={itemClass('/tickets')}><span>🎟️ Mis Tickets</span></Link>

        {role === 'operador' && (
          <div className="pt-4 space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Administración</p>
            <Link href="/reportes" className={itemClass('/reportes')}><span>📊 Reportes</span></Link>
            <Link href="/usuarios" className={itemClass('/usuarios')}><span>👥 Usuarios</span></Link>
          </div>
        )}
      </nav>

      <div className="pt-5 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
            {user.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user.nombre}</p>
            <p className="text-xs text-slate-500 truncate">{(user as any).email}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold group">
          <span>🚪 Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}