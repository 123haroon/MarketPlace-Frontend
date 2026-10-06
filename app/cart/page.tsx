"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>

          <p className="mt-4 text-gray-500">Your cart is empty.</p>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-6 rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>

      {/* CART ITEMS */}

      <div className="mt-8 space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            {/* PRODUCT IMAGE */}

            <div className="relative h-28 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* PRODUCT INFO */}

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>

              <p className="mt-1 text-gray-600">
                PKR {item.price.toLocaleString()}
              </p>

              {/* QUANTITY CONTROLS */}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  −
                </button>

                <span className="min-w-8 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              {/* ITEM TOTAL */}

              <p className="mt-4 font-semibold">
                Total: PKR {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            {/* REMOVE */}

            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY */}

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-semibold">Cart Total</span>

          <span className="text-xl font-bold sm:text-2xl">
            PKR {cartTotal.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout?type=cart")}
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}
