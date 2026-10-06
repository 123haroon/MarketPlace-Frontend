"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getProductBySlug } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";

import Button from "@/components/ui/Butoon";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug;

  const addToCart = useCartStore((state) => state.addToCart);

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  // --------------------------------------------------
  // GET PRODUCT
  // --------------------------------------------------

  const {
    data: product,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["product", slug],

    queryFn: () => getProductBySlug(slug),

    enabled: Boolean(slug),
  });

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid animate-pulse gap-8 md:grid-cols-2">
            <div className="h-[300px] rounded-2xl bg-slate-200 sm:h-[360px]" />

            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-slate-200" />

              <div className="h-8 w-1/2 rounded bg-slate-200" />

              <div className="h-20 rounded bg-slate-200" />

              <div className="h-28 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-semibold text-red-700">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-red-600">
              The product may no longer be available.
            </p>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/products")}
              className="mt-5"
            >
              ← Back to Products
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // IMPORTANT
  // product is now guaranteed
  // --------------------------------------------------

  const currentProduct = product;

  // --------------------------------------------------
  // PRODUCT IMAGES
  // --------------------------------------------------

  const images = currentProduct.images?.slice(0, 3) ?? [];

  const selectedProductImage = images[selectedImage] ?? images[0];

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const finalPrice = Number(currentProduct.salePrice ?? currentProduct.price);

  const regularPrice = Number(currentProduct.price);

  const hasSale =
    currentProduct.salePrice !== null &&
    Number(currentProduct.salePrice) < regularPrice;

  const discountPercentage = hasSale
    ? Math.round(((regularPrice - finalPrice) / regularPrice) * 100)
    : 0;

  // --------------------------------------------------
  // QUANTITY
  // --------------------------------------------------

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(currentProduct.stock, current + 1));
  }

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  function handleAddToCart() {
    if (currentProduct.stock <= 0) {
      toast.error("This product is out of stock");

      return;
    }

    const primaryImage =
      currentProduct.images.find((image) => image.isPrimary) ??
      currentProduct.images[0];

    addToCart(
      {
        id: currentProduct.id,

        name: currentProduct.name,

        price: finalPrice,

        image: primaryImage?.imageUrl ?? "",
      },

      quantity,
    );

    toast.success(`${currentProduct.name} added to cart`);
  }

  // --------------------------------------------------
  // BUY NOW
  // --------------------------------------------------

  function handleBuyNow() {
    if (currentProduct.stock <= 0) {
      toast.error("This product is out of stock");

      return;
    }

    router.push(
      `/checkout?type=buy-now&productId=${currentProduct.id}&quantity=${quantity}`,
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <div className="mb-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/products")}
            className="px-4 py-2 text-sm"
          >
            ← Back to Products
          </Button>
        </div>

        {/* ==========================================
            PRODUCT CARD
        ========================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* ======================================
                LEFT SIDE - IMAGE GALLERY
            ====================================== */}

            <div className="border-b border-slate-200 p-4 sm:p-5 md:border-b-0 md:border-r lg:p-7">
              {/* MAIN IMAGE */}

              <div className="flex h-[260px] items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-[320px] lg:h-[360px]">
                {selectedProductImage ? (
                  <img
                    src={selectedProductImage.imageUrl}
                    alt={currentProduct.name}
                    className="h-full w-full object-contain p-3 sm:p-4"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    No Product Image
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-slate-50 p-1.5 transition ${
                        selectedImage === index
                          ? "border-slate-900 shadow-sm"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${currentProduct.name} image ${index + 1}`}
                        className="h-full w-full object-contain"
                      />

                      {image.isPrimary && (
                        <span className="absolute bottom-1 left-1 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Main
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* IMAGE COUNT */}

              {images.length > 0 && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  {images.length} product{" "}
                  {images.length === 1 ? "image" : "images"}
                </p>
              )}
            </div>

            {/* ======================================
                RIGHT SIDE - PRODUCT INFO
            ====================================== */}

            <div className="p-5 sm:p-6 lg:p-8">
              {/* STATUS */}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    currentProduct.stock > 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {currentProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                {hasSale && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* PRODUCT NAME */}

              <h1 className="mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {currentProduct.name}
              </h1>

              {/* PRICE */}

              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  PKR {finalPrice.toLocaleString()}
                </p>

                {hasSale && (
                  <p className="pb-1 text-base text-slate-400 line-through sm:text-lg">
                    PKR {regularPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* AVAILABILITY */}

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Availability
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    currentProduct.stock > 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {currentProduct.stock > 0
                    ? `${currentProduct.stock} ${
                        currentProduct.stock !== 1 ? "items" : "item"
                      } available`
                    : "Currently unavailable"}
                </p>
              </div>

              {/* DESCRIPTION */}

              <div className="mt-6">
                <h2 className="text-base font-semibold text-slate-900">
                  Product Description
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {currentProduct.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* ======================================
                  QUANTITY
              ====================================== */}

              {currentProduct.stock > 0 && (
                <div className="mt-7">
                  <p className="text-sm font-semibold text-slate-900">
                    Quantity
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                      {/* MINUS */}

                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center text-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      {/* QUANTITY */}

                      <span className="flex h-11 min-w-12 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900">
                        {quantity}
                      </span>

                      {/* PLUS */}

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= currentProduct.stock}
                        className="flex h-11 w-11 items-center justify-center text-xl text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-xs text-slate-500">
                      Maximum: {currentProduct.stock}
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================
                  BUTTONS
              ====================================== */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {/* ADD TO CART */}

                <Button
                  type="button"
                  variant="outline"
                  disabled={currentProduct.stock <= 0}
                  onClick={handleAddToCart}
                  className="min-h-12 w-full px-6 py-3 text-sm font-semibold sm:text-base"
                >
                  {currentProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                {/* BUY NOW */}

                <Button
                  type="button"
                  variant="primary"
                  disabled={currentProduct.stock <= 0}
                  onClick={handleBuyNow}
                  className="min-h-12 w-full px-6 py-3 text-sm font-semibold sm:text-base"
                >
                  Buy Now
                </Button>
              </div>

              {/* ======================================
                  INFORMATION
              ====================================== */}

              <div className="mt-7 border-t border-slate-200 pt-5">
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-medium text-slate-800">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Your order information is handled securely.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-medium text-slate-800">Stock Verified</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Stock availability is checked before ordering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
