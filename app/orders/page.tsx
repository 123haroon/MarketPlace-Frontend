"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Button from "@/components/ui/Butoon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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
  subtotal: string;
  deliveryCharges: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
};

// --------------------------------------------------
// GET MY ORDERS
// --------------------------------------------------

async function getMyOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/api/orders/my-orders`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data.data;
}

// --------------------------------------------------
// CANCEL ORDER
// --------------------------------------------------

async function cancelOrder(orderId: number) {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel order");
  }

  return data.data;
}

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,

    onSuccess: () => {
      toast.success("Order cancelled successfully");

      queryClient.invalidateQueries({
        queryKey: ["my-orders"],
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order",
      );
    },
  });

  // --------------------------------------------------
  // CANCEL CONFIRMATION TOAST
  // --------------------------------------------------

  function handleCancelOrder(orderId: number) {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold text-slate-900">Cancel Order?</p>

          <p className="mt-2 text-sm text-slate-600">
            Are you sure you want to cancel this order?
          </p>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={() => {
                closeToast?.();
                cancelMutation.mutate(orderId);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Yes, Cancel
            </Button>

            <Button
              type="button"
              onClick={() => closeToast?.()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              No
            </Button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      },
    );
  }

  if (isPending) {
    return <main className="mx-auto max-w-6xl p-6">Loading orders...</main>;
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">Failed to load orders.</main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="mt-6 text-gray-500">
          You have not placed any orders yet.
        </p>
      </main>
    );
  }

  const activeOrders = orders.filter(
    (order) => order.orderStatus !== "cancelled",
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {activeOrders.length === 0 && (
        <p className="mt-8 text-gray-500">You have no active orders.</p>
      )}

      <div className="mt-8 space-y-6">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            {/* ORDER HEADER */}

            <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>

                <p className="font-semibold">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Date</p>

                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>

                <p className="font-bold">
                  PKR {Number(order.total).toLocaleString()}
                </p>
              </div>
            </div>

            {/* ITEMS */}

            <div className="divide-y">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <h2 className="font-semibold">{item.productName}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      PKR {Number(item.unitPrice).toLocaleString()} each
                    </p>
                  </div>

                  <p className="font-semibold">
                    PKR {Number(item.lineTotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* ORDER FOOTER */}

            <div className="flex flex-col gap-4 border-t p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  Order: {order.orderStatus}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  Payment: {order.paymentStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-gray-500">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </p>

                <Button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  View Details
                </Button>

                {["pending", "confirmed"].includes(order.orderStatus) && (
                  <Button
                    disabled={cancelMutation.isPending}
                    onClick={() => handleCancelOrder(order.id)}
                    className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancelMutation.isPending
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
