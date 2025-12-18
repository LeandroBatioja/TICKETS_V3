// components/auth/AuthLayout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  title: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerHref: string;
}

export default function AuthLayout({ title, children, footerText, footerLink, footerHref }: Props) {
  return (
    // Añadimos w-full y bg-slate-50 para que el fondo coincida con el resto de la app
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full bg-slate-50">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 w-full max-w-sm p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          {/* Un pequeño icono para darle identidad */}
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-indigo-200">
            🎫
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-tight">
            {title}
          </h1>
        </div>

        {children}

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          {footerText}
          <Link 
            href={footerHref} 
            className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 transition-colors"
          >
            {footerLink}
          </Link>
        </p>
      </div>
      
      {/* Opcional: Un pequeño footer de marca */}
      <p className="mt-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        TicketApp &copy; 2025
      </p>
    </div>
  );
}