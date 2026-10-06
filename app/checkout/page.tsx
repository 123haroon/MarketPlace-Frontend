"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Butoon";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function CheckoutPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();

  const checkoutType = searchParams.get("type");

  const productId = Number(searchParams.get("productId"));
  const quantity = Number(searchParams.get("quantity") ?? 1);

  const cart = useCartStore((state) => state.cart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState<{
    id: number;
    orderNumber: string;
    total: string;
  } | null>(null);

  // Only needed for Buy Now
  const { data: products = [], isPending: isProductLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    enabled: checkoutType === "buy-now",
  });

  const buyNowProduct = products.find((product) => product.id === productId);

  const summaryItems = useMemo(() => {
    if (checkoutType === "cart") {
      return cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
    }

    if (checkoutType === "buy-now" && buyNowProduct) {
      return [
        {
          id: buyNowProduct.id,
          name: buyNowProduct.name,
          price: Number(buyNowProduct.salePrice ?? buyNowProduct.price),
          quantity,
          image:
            buyNowProduct.images.find((image) => image.isPrimary)?.imageUrl ??
            buyNowProduct.images[0]?.imageUrl ??
            "",
        },
      ];
    }

    return [];
  }, [checkoutType, cart, buyNowProduct, quantity]);

  const subtotal = summaryItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessOrder(null);

    if (!name || !phone || !address || !city) {
      setError("Please complete your shipping details.");
      return;
    }

    if (summaryItems.length === 0) {
      setError("No products available for checkout.");
      return;
    }

    setIsSubmitting(true);

    try {
      let endpoint = "";
      let payload;

      // -------------------------
      // BUY NOW
      // -------------------------

      if (checkoutType === "buy-now") {
        endpoint = "/api/orders/buy-now";

        payload = {
          productId,
          quantity,
          paymentMethod: "COD",

          shippingAddress: {
            name,
            phone,
            address,
            city,
          },
        };
      }

      // -------------------------
      // CART CHECKOUT
      // -------------------------
      else if (checkoutType === "cart") {
        endpoint = "/api/orders/checkout-cart";

        payload = {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),

          paymentMethod: "COD",

          shippingAddress: {
            name,
            phone,
            address,
            city,
          },
        };
      } else {
        throw new Error("Invalid checkout type");
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }
      if (checkoutType === "cart") {
        clearCart();
      }

      setSuccessOrder({
        id: data.data.id,
        orderNumber: data.data.orderNumber,
        total: data.data.total,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkoutType === "buy-now" && isProductLoading) {
    return <main className="mx-auto max-w-6xl p-6">Loading checkout...</main>;
  }

  if (checkoutType === "buy-now" && !buyNowProduct) {
    return <main className="mx-auto max-w-6xl p-6">Product not found.</main>;
  }

  if (checkoutType === "cart" && cart.length === 0) {
    return <main className="mx-auto max-w-6xl p-6">Your cart is empty.</main>;
  }

  if (successOrder) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-green-700">
            Order placed successfully
          </h1>

          <div className="mt-6 space-y-2">
            <p>
              Order Number: <strong>{successOrder.orderNumber}</strong>
            </p>

            <p>
              Total:{" "}
              <strong>PKR {Number(successOrder.total).toLocaleString()}</strong>
            </p>

            <p>
              Payment Method: <strong>Cash on Delivery</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (checkoutType === "cart" && cart.length === 0) {
    return <main className="mx-auto max-w-6xl p-6">Your cart is empty.</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* SHIPPING */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Shipping Information</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>

              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Address</label>

              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">City</label>

              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Payment Method</p>

            <p className="mt-1 font-semibold">Cash on Delivery</p>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>

        {/* ORDER SUMMARY */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-5">
            {summaryItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 font-medium">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <span className="text-lg font-semibold">Total</span>

            <span className="text-2xl font-bold">
              PKR {subtotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
