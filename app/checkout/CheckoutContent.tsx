"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Butoon";

export default function CheckoutContent() {
  const searchParams = useSearchParams();

  // --------------------------------------------------
  // CART
  // --------------------------------------------------

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // --------------------------------------------------
  // SEARCH PARAMS
  // --------------------------------------------------

  const checkoutType = searchParams.get("type");

  const productId = Number(searchParams.get("productId"));

  const requestedQuantity = Number(searchParams.get("quantity") ?? 1);

  const quantity =
    Number.isInteger(requestedQuantity) && requestedQuantity > 0
      ? requestedQuantity
      : 1;

  // --------------------------------------------------
  // SHIPPING FORM
  // --------------------------------------------------

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  // --------------------------------------------------
  // REQUEST STATE
  // --------------------------------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [successOrder, setSuccessOrder] = useState<{
    id: number;
    orderNumber: string;
    total: string;
  } | null>(null);

  // --------------------------------------------------
  // PRODUCTS
  //
  // Only required for Buy Now checkout
  // --------------------------------------------------

  const {
    data: products = [],
    isPending: isProductLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["products"],

    queryFn: getProducts,

    enabled: checkoutType === "buy-now",
  });

  // --------------------------------------------------
  // BUY NOW PRODUCT
  // --------------------------------------------------

  const buyNowProduct = products.find((product) => product.id === productId);

  // --------------------------------------------------
  // ORDER SUMMARY ITEMS
  // --------------------------------------------------

  const summaryItems = useMemo(() => {
    // ------------------------------
    // CART
    // ------------------------------

    if (checkoutType === "cart") {
      return cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
    }

    // ------------------------------
    // BUY NOW
    // ------------------------------

    if (checkoutType === "buy-now" && buyNowProduct) {
      const primaryImage =
        buyNowProduct.images.find((image) => image.isPrimary) ??
        buyNowProduct.images[0];

      return [
        {
          id: buyNowProduct.id,

          name: buyNowProduct.name,

          price: Number(buyNowProduct.salePrice ?? buyNowProduct.price),

          quantity,

          image: primaryImage?.imageUrl ?? "",
        },
      ];
    }

    return [];
  }, [checkoutType, cart, buyNowProduct, quantity]);

  // --------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------

  const subtotal = summaryItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // --------------------------------------------------
  // SUBMIT ORDER
  // --------------------------------------------------

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    setSuccessOrder(null);

    // ------------------------------------------------
    // SHIPPING VALIDATION
    // ------------------------------------------------

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Please complete your shipping details.");

      return;
    }

    // ------------------------------------------------
    // CHECKOUT ITEMS
    // ------------------------------------------------

    if (summaryItems.length === 0) {
      setError("No products available for checkout.");

      return;
    }

    setIsSubmitting(true);

    try {
      let endpoint = "";

      let payload:
        | {
            productId: number;
            quantity: number;
            paymentMethod: string;
            shippingAddress: {
              name: string;
              phone: string;
              address: string;
              city: string;
            };
          }
        | {
            items: {
              productId: number;
              quantity: number;
            }[];
            paymentMethod: string;
            shippingAddress: {
              name: string;
              phone: string;
              address: string;
              city: string;
            };
          };

      // ==============================================
      // BUY NOW
      // ==============================================

      if (checkoutType === "buy-now") {
        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("Invalid product");
        }

        endpoint = "/api/orders/buy-now";

        payload = {
          productId,

          quantity,

          paymentMethod: "COD",

          shippingAddress: {
            name: name.trim(),

            phone: phone.trim(),

            address: address.trim(),

            city: city.trim(),
          },
        };
      }

      // ==============================================
      // CART CHECKOUT
      // ==============================================
      else if (checkoutType === "cart") {
        endpoint = "/api/orders/checkout-cart";

        payload = {
          items: cart.map((item) => ({
            productId: item.id,

            quantity: item.quantity,
          })),

          paymentMethod: "COD",

          shippingAddress: {
            name: name.trim(),

            phone: phone.trim(),

            address: address.trim(),

            city: city.trim(),
          },
        };
      }

      // ==============================================
      // INVALID TYPE
      // ==============================================
      else {
        throw new Error("Invalid checkout type");
      }

      // ------------------------------------------------
      // API REQUEST
      // ------------------------------------------------

      const response = await fetch(endpoint, {
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

      // ------------------------------------------------
      // CLEAR CART
      // ------------------------------------------------

      if (checkoutType === "cart") {
        clearCart();
      }

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

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

  // ==================================================
  // BUY NOW LOADING
  // ==================================================

  if (checkoutType === "buy-now" && isProductLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading checkout...</p>
        </div>
      </main>
    );
  }

  // ==================================================
  // PRODUCTS ERROR
  // ==================================================

  if (checkoutType === "buy-now" && isProductsError) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">Failed to load product.</p>
        </div>
      </main>
    );
  }

  // ==================================================
  // BUY NOW PRODUCT NOT FOUND
  // ==================================================

  if (checkoutType === "buy-now" && !buyNowProduct) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Product not found.</p>
        </div>
      </main>
    );
  }

  // ==================================================
  // CART EMPTY
  // ==================================================

  if (checkoutType === "cart" && cart.length === 0 && !successOrder) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Your cart is empty.</p>
        </div>
      </main>
    );
  }

  // ==================================================
  // INVALID CHECKOUT
  // ==================================================

  if (checkoutType !== "buy-now" && checkoutType !== "cart") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">Invalid checkout request.</p>
        </div>
      </main>
    );
  }

  // ==================================================
  // SUCCESS
  // ==================================================

  if (successOrder) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-green-700 sm:text-3xl">
            Order placed successfully
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Thank you. Your order has been received.
          </p>

          <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Order Number</span>

              <strong className="text-slate-900">
                {successOrder.orderNumber}
              </strong>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Total</span>

              <strong className="text-slate-900">
                PKR {Number(successOrder.total).toLocaleString()}
              </strong>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">Payment Method</span>

              <strong className="text-slate-900">Cash on Delivery</strong>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // CHECKOUT PAGE
  // ==================================================

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Checkout
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Complete your shipping details and review your order.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* ==========================================
            SHIPPING
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Shipping Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the address where you want your order delivered.
          </p>

          <div className="mt-6 space-y-4">
            {/* NAME */}

            <div>
              <label
                htmlFor="checkout-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                htmlFor="checkout-phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone
              </label>

              <input
                id="checkout-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="03XX XXXXXXX"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* ADDRESS */}

            <div>
              <label
                htmlFor="checkout-address"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Address
              </label>

              <textarea
                id="checkout-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                placeholder="House, street and area"
                required
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* CITY */}

            <div>
              <label
                htmlFor="checkout-city"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                City
              </label>

              <input
                id="checkout-city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Your city"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* PAYMENT */}

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Payment Method
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              Cash on Delivery
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>

        {/* ==========================================
            ORDER SUMMARY
        ========================================== */}

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold text-slate-900">
            Order Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your items before placing the order.
          </p>

          <div className="mt-6 divide-y divide-slate-100">
            {summaryItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                {/* IMAGE */}

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                    No Image
                  </div>
                )}

                {/* INFO */}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}

          <div className="mt-4 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Total
              </span>

              <span className="text-2xl font-bold text-slate-900">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Payment will be collected on delivery.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
