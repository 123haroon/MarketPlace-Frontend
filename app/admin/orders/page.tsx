"use client";

import { useState } from "react";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import Pagination from "@/components/ui/Pagination";
import Select from "../component/ui/Select";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type OrderItem = {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

type Order = {
  id: number;
  orderNumber: string;
  userId: number;

  subtotal: string;
  deliveryCharges: string;
  total: string;

  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;

  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
};

type PaginationData = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type AdminOrdersResponse = {
  orders: Order[];
  pagination: PaginationData;
};

// --------------------------------------------------
// STATUS OPTIONS
// --------------------------------------------------

const statusTransitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],

  confirmed: ["processing", "cancelled"],

  processing: ["shipped", "cancelled"],

  shipped: ["delivered"],

  delivered: [],

  cancelled: [],
};

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

// --------------------------------------------------
// GET ADMIN ORDERS
// --------------------------------------------------

async function getAdminOrders(
  page: number,
  limit: number,
): Promise<AdminOrdersResponse> {
  const response = await fetch(
    `${API_URL}/api/admin/orders?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return {
    orders: data.orders ?? [],
    pagination: data.pagination,
  };
}

// --------------------------------------------------
// UPDATE ORDER STATUS
// --------------------------------------------------

async function updateOrderStatus({
  orderId,
  orderStatus,
}: {
  orderId: number;
  orderStatus: string;
}) {
  const response = await fetch(
    `${API_URL}/api/admin/orders/${orderId}/status`,
    {
      method: "PATCH",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        orderStatus,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status");
  }

  return data.data;
}

// --------------------------------------------------
// UPDATE PAYMENT STATUS
// --------------------------------------------------

async function updatePaymentStatus({
  orderId,
  paymentStatus,
}: {
  orderId: number;
  paymentStatus: string;
}) {
  const response = await fetch(
    `${API_URL}/api/admin/orders/${orderId}/payment-status`,
    {
      method: "PATCH",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        paymentStatus,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update payment status");
  }

  return data.data;
}

// --------------------------------------------------
// PAGE
// --------------------------------------------------

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  const limit = 10;

  // --------------------------------------------------
  // FETCH ORDERS
  // --------------------------------------------------

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin-orders", page],

    queryFn: () => getAdminOrders(page, limit),
  });

  const orders = data?.orders ?? [];

  const pagination = data?.pagination;

  // --------------------------------------------------
  // ORDER STATUS MUTATION
  // --------------------------------------------------

  const orderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      toast.success("Order status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    },
  });

  // --------------------------------------------------
  // PAYMENT STATUS MUTATION
  // --------------------------------------------------

  const paymentStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,

    onSuccess: () => {
      toast.success("Payment status updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update payment status",
      );
    },
  });

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {error instanceof Error ? error.message : "Failed to load orders"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customer orders, payments and delivery status.
            </p>
          </div>

          {pagination && (
            <div className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Total Orders: {pagination.totalItems}
            </div>
          )}
        </div>

        {/* EMPTY */}

        {orders.length === 0 && (
          <div className="mt-8 rounded-xl border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">No orders found</h2>

            <p className="mt-2 text-sm text-slate-500">
              Customer orders will appear here.
            </p>
          </div>
        )}

        {/* =============================================
            MOBILE / TABLET
        ============================================= */}

        <div className="mt-8 space-y-4 lg:hidden">
          {orders.map((order) => {
            const nextStatuses = statusTransitions[order.orderStatus] ?? [];

            const isUpdatingOrder =
              orderStatusMutation.isPending &&
              orderStatusMutation.variables?.orderId === order.id;

            const isUpdatingPayment =
              paymentStatusMutation.isPending &&
              paymentStatusMutation.variables?.orderId === order.id;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* CARD HEADER */}

                <div className="border-b bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Order Number</p>

                      <p className="truncate font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* DETAILS */}

                <div className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* CUSTOMER */}

                    <div>
                      <p className="text-xs text-slate-500">Customer</p>

                      <p className="mt-1 font-medium">{order.shippingName}</p>

                      <p className="text-sm text-slate-500">
                        {order.shippingPhone}
                      </p>
                    </div>

                    {/* TOTAL */}

                    <div>
                      <p className="text-xs text-slate-500">Total</p>

                      <p className="mt-1 text-lg font-bold">
                        PKR {Number(order.total).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* PRODUCTS */}

                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Products
                    </p>

                    <div className="mt-2 space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="truncate">{item.productName}</span>

                          <span className="shrink-0 text-slate-500">
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PAYMENT STATUS */}

                  <div className="mt-4">
                    <Select
                      label="Payment Status"
                      value={order.paymentStatus}
                      disabled={isUpdatingPayment}
                      options={paymentStatuses.map((status) => ({
                        label: status,
                        value: status,
                      }))}
                      onChange={(event) =>
                        paymentStatusMutation.mutate({
                          orderId: order.id,

                          paymentStatus: event.target.value,
                        })
                      }
                    />
                  </div>

                  {/* ORDER STATUS */}

                  <div className="mt-4">
                    {nextStatuses.length > 0 ? (
                      <Select
                        label="Order Status"
                        value=""
                        disabled={isUpdatingOrder}
                        options={[
                          {
                            label: "Change status",
                            value: "",
                          },

                          ...nextStatuses.map((status) => ({
                            label: status,
                            value: status,
                          })),
                        ]}
                        onChange={(event) => {
                          const value = event.target.value;

                          if (!value) {
                            return;
                          }

                          orderStatusMutation.mutate({
                            orderId: order.id,

                            orderStatus: value,
                          });
                        }}
                      />
                    ) : (
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-500">
                          Order Status
                        </p>

                        <div className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm capitalize text-slate-600">
                          {order.orderStatus}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VIEW */}

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="mt-4 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* =============================================
            DESKTOP TABLE
        ============================================= */}

        {orders.length > 0 && (
          <div className="mt-8 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {[
                      "Order",
                      "Customer",
                      "Items",
                      "Total",
                      "Payment",
                      "Order Status",
                      "Action",
                    ].map((item) => (
                      <th key={item} className="px-5 py-4">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => {
                    const nextStatuses =
                      statusTransitions[order.orderStatus] ?? [];

                    const isUpdatingOrder =
                      orderStatusMutation.isPending &&
                      orderStatusMutation.variables?.orderId === order.id;

                    const isUpdatingPayment =
                      paymentStatusMutation.isPending &&
                      paymentStatusMutation.variables?.orderId === order.id;

                    return (
                      <tr
                        key={order.id}
                        className="text-sm transition hover:bg-slate-50"
                      >
                        {/* ORDER */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">
                          <p className="font-medium">{order.shippingName}</p>

                          <p className="mt-1 text-xs text-slate-500">
                            {order.shippingPhone}
                          </p>
                        </td>

                        {/* ITEMS */}

                        <td className="px-5 py-4">
                          <p>
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                        </td>

                        {/* TOTAL */}

                        <td className="whitespace-nowrap px-5 py-4 font-semibold">
                          PKR {Number(order.total).toLocaleString()}
                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-4">
                          <Select
                            value={order.paymentStatus}
                            disabled={isUpdatingPayment}
                            options={paymentStatuses.map((status) => ({
                              label: status,
                              value: status,
                            }))}
                            onChange={(event) =>
                              paymentStatusMutation.mutate({
                                orderId: order.id,

                                paymentStatus: event.target.value,
                              })
                            }
                          />
                        </td>

                        {/* ORDER STATUS */}

                        <td className="px-5 py-4">
                          <div className="space-y-2">
                            <span className="block text-xs font-medium capitalize text-slate-700">
                              {order.orderStatus}
                            </span>

                            {nextStatuses.length > 0 && (
                              <Select
                                value=""
                                disabled={isUpdatingOrder}
                                options={[
                                  {
                                    label: "Change",
                                    value: "",
                                  },

                                  ...nextStatuses.map((status) => ({
                                    label: status,
                                    value: status,
                                  })),
                                ]}
                                onChange={(event) => {
                                  const value = event.target.value;

                                  if (!value) {
                                    return;
                                  }

                                  orderStatusMutation.mutate({
                                    orderId: order.id,

                                    orderStatus: value,
                                  });
                                }}
                              />
                            )}
                          </div>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
      </div>
    </main>
  );
}
