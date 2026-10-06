"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Pagination from "@/components/ui/Pagination";

import { getAdminUsers } from "@/lib/admin";

export default function AdminUsersPage() {
  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  const limit = 10;

  // --------------------------------------------------
  // GET USERS
  // --------------------------------------------------

  const { data, isPending, isError } = useQuery({
    queryKey: ["admin", "users", page],

    queryFn: () => getAdminUsers(page, limit),
  });

  const users = data?.users ?? [];

  const pagination = data?.pagination;

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading users...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">Failed to load users.</p>
      </div>
    );
  }

  return (
    <section>
      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Users</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage registered MarketStore users.
        </p>

        {pagination && (
          <p className="mt-1 text-xs text-slate-400">
            Total Users: {pagination.totalItems}
          </p>
        )}
      </div>

      {/* DESKTOP TABLE */}

      {users.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {["ID", "Name", "Email", "Role", "Joined"].map((item) => (
                    <th
                      key={item}
                      className="px-5 py-4 text-sm font-semibold text-slate-700"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {user.id}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {user.name}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOBILE CARDS */}

      {users.length > 0 && (
        <div className="space-y-3 md:hidden">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-900">
                    {user.name}
                  </h2>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>ID: {user.id}</span>

                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}

      {users.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">No users found.</p>
        </div>
      )}

      {/* PAGINATION */}

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
