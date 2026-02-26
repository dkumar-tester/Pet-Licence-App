import * as React from "react";
import { Link, Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-slate-900">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Pet Licence
          </Link>
          <nav className="flex gap-4 text-sm text-slate-500">
            <Link to="/apply" className="hover:text-slate-900">
              Apply
            </Link>
            <Link
              to="/admin/applications"
              className="hover:text-slate-900"
            >
              Admin
            </Link>
            <Link to="/admin/dashboard" className="hover:text-slate-900">
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


