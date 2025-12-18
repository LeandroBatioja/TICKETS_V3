// components/SidebarWrapper.tsx
'use client';

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // 1. Mientras el contexto carga, mostramos un estado neutro
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // 2. Si estamos en login o no hay usuario, pantalla limpia (sin Sidebar)
  if (!user || pathname === '/login') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  // 3. Si hay usuario, estructura con Sidebar
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}