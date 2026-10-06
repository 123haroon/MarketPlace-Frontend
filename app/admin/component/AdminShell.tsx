"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import AdminNavbar from "./Navbar";
import withAdmin from "./withAdmin";

type AdminShellProps = {
  children: ReactNode;
};

function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Sidebar */}

      <aside className="w-full bg-slate-900 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="p-4 sm:p-5 md:p-6">
          <h2 className="text-lg font-bold sm:text-xl">Admin Panel</h2>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:mt-6 md:flex-col md:overflow-visible md:pb-0">
            <Link
              href="/admin"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Products
            </Link>

            <Link
              href="/admin/users"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Users
            </Link>

            <Link
              href="/admin/orders"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Orders
            </Link>
          </nav>
        </div>
      </aside>

      {/* Right Side */}

      <div className="min-w-0 flex-1">
        <AdminNavbar />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default withAdmin(AdminShell);
