"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "@/lib/admin";

// -----------------------------------
// DASHBOARD STATS TYPE
// -----------------------------------

type DashboardStats = {
  totalUsers?: number;
  totalProducts?: number;
  totalOrders?: number;
};

export default function AdminDashboard() {
  const {
    data: stats,
    isError,
    isPending,
  } = useQuery<DashboardStats>({
    queryKey: ["admin", "dashboardStats"],

    queryFn: async () => {
      const data = await getDashboardStats();

      return data as DashboardStats;
    },
  });

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">Overview of your store.</p>
        </div>

        {/* STATS */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* TOTAL PRODUCTS */}

          <Link
            href="/admin/products"
            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 sm:text-base">
                  Total Products
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {isPending
                    ? "..."
                    : isError
                      ? "0"
                      : (stats?.totalProducts ?? 0)}
                </h2>
              </div>

              <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-gray-400">
              View products
            </p>
          </Link>

          {/* TOTAL USERS */}

          <Link
            href="/admin/users"
            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 sm:text-base">
                  Total Users
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {isPending ? "..." : isError ? "0" : (stats?.totalUsers ?? 0)}
                </h2>
              </div>

              <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-gray-400">View users</p>
          </Link>

          {/* TOTAL ORDERS */}

          <Link
            href="/admin/orders"
            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:col-span-2 sm:p-6 lg:col-span-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 sm:text-base">
                  Total Orders
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {isPending
                    ? "..."
                    : isError
                      ? "0"
                      : (stats?.totalOrders ?? 0)}
                </h2>
              </div>

              <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-gray-400">
              View orders
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
