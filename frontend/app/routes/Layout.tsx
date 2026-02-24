import * as React from "react";
import { Link, Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="mesh-bg absolute inset-0" />
      </div>

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Pet Licence
          </Link>
          <nav className="flex gap-4 text-sm text-slate-300">
            <Link to="/apply" className="hover:text-slate-50">
              Apply
            </Link>
            <Link to="/admin/applications" className="hover:text-slate-50">
              Admin
            </Link>
            <Link to="/admin/dashboard" className="hover:text-slate-50">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};


