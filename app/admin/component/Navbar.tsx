import Link from "next/link";
import LogoutButton from "@/components/LogOut";

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="min-w-0">
          <Link
            href="/admin"
            className="block truncate text-base font-bold text-slate-900 sm:text-lg"
          >
            MarketStore Admin
          </Link>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your store
          </p>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            View Store
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
