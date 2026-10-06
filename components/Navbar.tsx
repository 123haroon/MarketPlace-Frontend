"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useCartStore } from "@/store/cartStore";
import { getCurrentUser } from "@/lib/auth";

import Button from "./ui/Butoon";
import LogoutButton from "./LogOut";

const baseNavLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Cart",
    href: "/cart",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const cart = useCartStore((state) => state.cart);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // -----------------------------
  // CURRENT USER
  // -----------------------------

  const { data: user, isPending: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !pathname.startsWith("/admin"),
  });

  // -----------------------------
  // NAV LINKS
  // -----------------------------

  const navLinks = user
    ? [
        ...baseNavLinks,
        {
          name: "My Orders",
          href: "/orders",
        },
      ]
    : baseNavLinks;

  // -----------------------------
  // CLOSE MENU ON ROUTE CHANGE
  // -----------------------------

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // -----------------------------
  // MOBILE BODY SCROLL LOCK
  // -----------------------------

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // -----------------------------
  // HIDE CUSTOMER NAV ON ADMIN
  // -----------------------------

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-[72px] sm:px-5 lg:px-6 xl:px-8">
          {/* -----------------------------
              LOGO
          ----------------------------- */}

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex min-w-0 items-center gap-2 text-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-900 sm:h-10 sm:w-10">
              M
            </span>

            <span className="truncate text-lg font-bold tracking-tight sm:text-xl xl:text-2xl">
              MarketStore
            </span>
          </Link>

          {/* =========================================
              DESKTOP NAV
              Starts only at 1024px
          ========================================= */}

          <div className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition xl:px-3 ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.name}

                  {link.href === "/cart" && cartCount > 0 && (
                    <span className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-slate-900">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* =========================================
              DESKTOP AUTH
          ========================================= */}

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
            {isUserLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-800" />
            ) : user ? (
              <>
                {/* CURRENT USER */}

                <div className="max-w-32 text-right">
                  <p className="text-[11px] text-slate-400">Welcome</p>

                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                </div>

                {/* ADMIN DASHBOARD */}

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Dashboard
                  </Link>
                )}

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 xl:px-4"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* =========================================
              MOBILE / TABLET CONTROLS
              Visible below 1024px
          ========================================= */}

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {/* CART */}

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-white transition active:scale-95"
              aria-label="Shopping cart"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />

                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-slate-900">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* HAMBURGER */}

            <Button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              className="flex h-10 w-10 items-center justify-center border border-slate-700 p-0 text-white lg:hidden"
            >
              <span className="text-xl leading-none">
                {isOpen ? "✕" : "☰"}
              </span>
            </Button>
          </div>
        </nav>
      </header>

      {/* =========================================
          MOBILE/TABLET OVERLAY
      ========================================= */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 top-16 z-40 bg-black/50 sm:top-[72px] lg:hidden"
        />
      )}

      {/* =========================================
          MOBILE/TABLET DRAWER
      ========================================= */}

      <aside
        className={`fixed right-0 top-16 z-50 h-[calc(100dvh-64px)] w-[85vw] max-w-[360px] transform overflow-y-auto border-l border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 sm:top-[72px] sm:h-[calc(100dvh-72px)] sm:w-[380px] sm:max-w-[90vw] lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col p-4 sm:p-5">
          {/* -----------------------------
              USER CARD
          ----------------------------- */}

          {isUserLoading ? (
            <div className="mb-5 h-20 animate-pulse rounded-xl bg-slate-800" />
          ) : (
            user && (
              <div className="mb-5 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Signed in as
                </p>

                <p className="mt-1 truncate font-semibold text-white">
                  {user.name}
                </p>

                {user.email && (
                  <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
                    {user.email}
                  </p>
                )}
              </div>
            )
          )}

          {/* -----------------------------
              MOBILE LINKS
          ----------------------------- */}

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>

                  {link.href === "/cart" && cartCount > 0 ? (
                    <span
                      className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-900"
                      }`}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  ) : (
                    <span className="text-lg opacity-40">›</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* -----------------------------
              BOTTOM AUTH
          ----------------------------- */}

          <div className="mt-auto pt-8">
            <div className="mb-5 border-t border-slate-800" />

            {isUserLoading ? (
              <div className="h-12 animate-pulse rounded-xl bg-slate-800" />
            ) : user ? (
              <div className="flex flex-col gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <LogoutButton />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              MarketStore
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
