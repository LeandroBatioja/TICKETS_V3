// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout, user, loading } = useAuth();

  // 1. Evitamos el flash de contenido durante la hidratación o carga
  if (loading || !user) return null;

  // 2. Función de clases optimizada para scannability
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
      {/* BRAND / LOGO */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <span className="text-white text-xl">🎫</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            TicketApp
          </h2>
        </div>
        <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
          {role}
        </div>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="space-y-1.5 flex-grow">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Menú Principal
        </p>
        
        <Link href="/" className={itemClass('/')}>
          <span className="text-lg">🏠</span>
          <span>Inicio</span>
        </Link>

        <Link href="/tickets" className={itemClass('/tickets')}>
          <span className="text-lg">🎟️</span>
          <span>Mis Tickets</span>
        </Link>

        {/* VISTAS EXCLUSIVAS PARA OPERADOR */}
        {role === 'operador' && (
          <div className="pt-4 space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Administración
            </p>
            <Link href="/reportes" className={itemClass('/reportes')}>
              <span className="text-lg">📊</span>
              <span>Reportes</span>
            </Link>
            <Link href="/usuarios" className={itemClass('/usuarios')}>
              <span className="text-lg">👥</span>
              <span>Usuarios</span>
            </Link>
          </div>
        )}
      </nav>

      {/* PERFIL Y LOGOUT */}
      <div className="pt-5 border-t border-slate-100">
      {/* Contenedor del perfil de usuario (opcional) */}
      <div className="flex items-center gap-3 mb-4 px-2 lg:flex-row flex-col">
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
          {user?.nombre?.charAt(0).toUpperCase()}
        </div>
        <div className="hidden lg:block flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{user?.nombre}</p>
        </div>
      </div>
      
      {/* BOTÓN CERRAR SESIÓN CON TOOLTIP */}
      <div className="relative group">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <span className="text-2xl transition-transform group-hover:scale-110">
            🚪
          </span>
          <span className="hidden lg:block font-bold text-sm">Salir</span>
        </button>

        {/* ESTE ES EL CUADRITO QUE APARECE AL TOCAR LA PUERTA */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 lg:hidden">
          Cerrar Sesión
          {/* Flechita del tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
        </div>
      </div>
</div>
    </aside>
  );
}