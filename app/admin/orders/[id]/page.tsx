"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

// --------------------------------------------------
// ORDER STATUS FLOW
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
// GET SINGLE ADMIN ORDER
// --------------------------------------------------

async function getAdminOrder(orderId: number): Promise<Order> {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data.data;
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

export default function AdminOrderDetailsPage() {
  const params = useParams();

  const queryClient = useQueryClient();

  const orderId = Number(params.id);

  // --------------------------------------------------
  // GET ORDER
  // --------------------------------------------------

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-order", orderId],

    queryFn: () => getAdminOrder(orderId),

    enabled: Number.isInteger(orderId) && orderId > 0,
  });

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------

  const orderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-order", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });

  // --------------------------------------------------
  // UPDATE PAYMENT STATUS
  // --------------------------------------------------

  const paymentStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-order", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });

  // --------------------------------------------------
  // INVALID ID
  // --------------------------------------------------

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            Invalid order ID.
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-60 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError || !order) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {error instanceof Error ? error.message : "Failed to load order"}
          </div>
        </div>
      </main>
    );
  }

  const nextStatuses = statusTransitions[order.orderStatus] ?? [];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* ======================================
            BACK
        ====================================== */}

        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          ← Back to Orders
        </Link>

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Order Number</p>

              <h1 className="mt-1 break-all text-xl font-bold text-slate-900 sm:text-2xl">
                {order.orderNumber}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium capitalize text-blue-700">
                {order.orderStatus}
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium capitalize text-green-700">
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================
            MUTATION ERROR
        ====================================== */}

        {(orderStatusMutation.isError || paymentStatusMutation.isError) && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {orderStatusMutation.error instanceof Error
              ? orderStatusMutation.error.message
              : paymentStatusMutation.error instanceof Error
                ? paymentStatusMutation.error.message
                : "Something went wrong"}
          </div>
        )}

        {/* ======================================
            GRID
        ====================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* ====================================
              LEFT
          ==================================== */}

          <div className="space-y-6 xl:col-span-2">
            {/* ------------------------------
                ORDER ITEMS
            ------------------------------ */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Items
                </h2>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {item.productName}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm text-slate-500">
                        <p>Product ID: {item.productId ?? "Deleted"}</p>

                        <p>Quantity: {item.quantity}</p>

                        <p>
                          Unit Price: PKR{" "}
                          {Number(item.unitPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-slate-500">Line Total</p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        PKR {Number(item.lineTotal).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ------------------------------
                CUSTOMER / SHIPPING
            ------------------------------ */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Customer & Shipping
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.shippingName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.shippingPhone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    City
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.shippingCity}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {order.userId}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Delivery Address
                  </p>

                  <p className="mt-1 leading-6 text-slate-900">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ====================================
              RIGHT
          ==================================== */}

          <div className="space-y-6">
            {/* ------------------------------
                STATUS MANAGEMENT
            ------------------------------ */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Manage Order
              </h2>

              {/* ORDER STATUS */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Order Status
                </label>

                <div className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium capitalize">
                  {order.orderStatus}
                </div>

                {nextStatuses.length > 0 && (
                  <select
                    value=""
                    disabled={orderStatusMutation.isPending}
                    onChange={(event) => {
                      const value = event.target.value;

                      if (!value) {
                        return;
                      }

                      const confirmed = window.confirm(
                        `Change order status from ${order.orderStatus} to ${value}?`,
                      );

                      if (!confirmed) {
                        return;
                      }

                      orderStatusMutation.mutate({
                        orderId: order.id,

                        orderStatus: value,
                      });
                    }}
                    className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm capitalize outline-none focus:border-slate-900"
                  >
                    <option value="">Change order status</option>

                    {nextStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* PAYMENT STATUS */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Status
                </label>

                <select
                  value={order.paymentStatus}
                  disabled={paymentStatusMutation.isPending}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === order.paymentStatus) {
                      return;
                    }

                    paymentStatusMutation.mutate({
                      orderId: order.id,

                      paymentStatus: value,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm capitalize outline-none focus:border-slate-900"
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* ------------------------------
                ORDER SUMMARY
            ------------------------------ */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-medium">
                    PKR {Number(order.subtotal).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Delivery</span>

                  <span className="font-medium">
                    PKR {Number(order.deliveryCharges).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Payment Method</span>

                  <span className="text-right font-medium">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold">Total</span>

                    <span className="text-xl font-bold">
                      PKR {Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
