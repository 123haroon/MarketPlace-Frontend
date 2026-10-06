"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProducts, type Product } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";

import Button from "@/components/ui/Butoon";

export default function ProductsPage() {
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);

  // --------------------------------------------------
  // GET PRODUCTS
  // --------------------------------------------------

  const {
    data: products = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  function handleAddToCart(product: Product) {
    const primaryImage =
      product.images.find((image) => image.isPrimary) ?? product.images[0];

    const finalPrice = Number(product.salePrice ?? product.price);

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: primaryImage?.imageUrl ?? "",
      },
      1,
    );
  }

  // --------------------------------------------------
  // BUY NOW
  // --------------------------------------------------

  function handleBuyNow(product: Product) {
    router.push(`/checkout?type=buy-now&productId=${product.id}&quantity=1`);
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return <main className="mx-auto max-w-7xl p-6">Loading products...</main>;
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl p-6">Failed to load products.</main>
    );
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">No products found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}

      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const primaryImage =
            product.images.find((image) => image.isPrimary) ??
            product.images[0];

          const displayPrice = product.salePrice ?? product.price;

          return (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.slug}`)}
              className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* PRODUCT IMAGE */}

              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                {primaryImage ? (
                  <img
                    src={primaryImage.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              {/* PRODUCT INFO */}

              <div className="p-4">
                <h2 className="truncate text-lg font-semibold text-slate-900">
                  {product.name}
                </h2>

                {/* PRICE */}

                <p className="mt-2 text-xl font-bold text-slate-900">
                  PKR {Number(displayPrice).toLocaleString()}
                </p>

                {/* ORIGINAL PRICE */}

                {product.salePrice && (
                  <p className="text-sm text-slate-400 line-through">
                    PKR {Number(product.price).toLocaleString()}
                  </p>
                )}

                {/* STOCK */}

                <p
                  className={`mt-3 text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </p>

                {/* BUTTONS */}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {/* ADD TO CART */}

                  <Button
                    type="button"
                    variant="outline"
                    disabled={product.stock <= 0}
                    onClick={(event) => {
                      // Product card click ko stop karo
                      event.stopPropagation();

                      handleAddToCart(product);
                    }}
                    className="flex-1 px-3 py-3"
                  >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>

                  {/* BUY NOW */}

                  <Button
                    type="button"
                    variant="primary"
                    disabled={product.stock <= 0}
                    onClick={(event) => {
                      // Product detail page open na ho
                      event.stopPropagation();

                      handleBuyNow(product);
                    }}
                    className="flex-1 px-3 py-3"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
