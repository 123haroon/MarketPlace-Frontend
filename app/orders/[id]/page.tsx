"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type OrderItem = {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
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

async function getOrderById(orderId: number): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data.data;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = Number(params.id);

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return <main className="mx-auto max-w-5xl p-6">Invalid order ID.</main>;
  }

  if (isPending) {
    return <main className="mx-auto max-w-5xl p-6">Loading order...</main>;
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load order"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* BACK */}

      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to My Orders
      </button>

      {/* HEADER */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>

            <h1 className="mt-1 text-2xl font-bold">{order.orderNumber}</h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Order: {order.orderStatus}
            </span>

            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* LEFT SIDE */}

        <div className="space-y-6 lg:col-span-2">
          {/* ITEMS */}

          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>

            <div className="divide-y">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{item.productName}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Unit Price: PKR {Number(item.unitPrice).toLocaleString()}
                    </p>
                  </div>

                  <p className="font-semibold">
                    PKR {Number(item.lineTotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPPING */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Shipping Information</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{order.shippingName}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.shippingPhone}</p>
              </div>

              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>

              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{order.shippingCity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>

                <span>PKR {Number(order.subtotal).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charges</span>

                <span>
                  PKR {Number(order.deliveryCharges).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>

                <span>
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>

                  <span className="text-xl font-bold">
                    PKR {Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
