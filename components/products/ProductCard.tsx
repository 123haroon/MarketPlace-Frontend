import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];

  const displayPrice = product.salePrice ?? product.price;

  const isOnSale = product.salePrice !== null;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h2 className="line-clamp-1 text-lg font-semibold text-slate-900 hover:underline">
            {product.name}
          </h2>
        </Link>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-slate-900">
              PKR {Number(displayPrice).toLocaleString()}
            </p>

            {isOnSale && (
              <p className="text-sm text-slate-400 line-through">
                PKR {Number(product.price).toLocaleString()}
              </p>
            )}
          </div>

          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
