"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import Button from "@/components/ui/Butoon";
import Pagination from "@/components/ui/Pagination";

import {
  deleteProduct,
  getAdminProducts,
  type Product,
} from "@/lib/products";

export default function AdminProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const [page, setPage] = useState(1);

  const limit = 10;

  // --------------------------------------------------
  // GET PRODUCTS
  // --------------------------------------------------

  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-products", page],

    queryFn: () =>
      getAdminProducts(page, limit),
  });

  const products = data?.products ?? [];

  const pagination = data?.pagination;

  // --------------------------------------------------
  // DELETE PRODUCT
  // --------------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: async () => {
      toast.success(
        "Product deleted successfully",
      );

      // Agar page par sirf 1 product tha
      // aur current page first page nahi hai
      // to previous page par chale jao
      if (
        products.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) => current - 1,
        );
      }

      await Promise.all([
        // Admin product list
        queryClient.invalidateQueries({
          queryKey: [
            "admin-products",
          ],
        }),

        // Customer product list
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        // Dashboard total products
        queryClient.invalidateQueries({
          queryKey: [
            "admin",
            "dashboardStats",
          ],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete product",
      );
    },
  });

  // --------------------------------------------------
  // DELETE CONFIRMATION
  // --------------------------------------------------

  function handleDeleteProduct(
    product: Product,
  ) {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold text-slate-900">
            Delete Product?
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Are you sure you want to
            delete{" "}
            <span className="font-semibold text-slate-900">
              {product.name}
            </span>
            ?
          </p>

          <p className="mt-2 text-xs text-red-500">
            This action cannot be
            undone.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="danger"
              disabled={
                deleteMutation.isPending
              }
              onClick={() => {
                closeToast?.();

                deleteMutation.mutate(
                  product.id,
                );
              }}
            >
              Yes, Delete
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                closeToast?.()
              }
            >
              Cancel
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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <main className="p-4 sm:p-6">
        Loading products...
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError) {
    return (
      <main className="p-4 sm:p-6">
        Failed to load products.
      </main>
    );
  }

  return (
    <main className="w-full">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your store products.
          </p>

          {pagination && (
            <p className="mt-1 text-xs text-slate-400">
              Total Products:{" "}
              {pagination.totalItems}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() =>
            router.push(
              "/admin/products/add",
            )
          }
        >
          + Add Product
        </Button>
      </div>

      {/* EMPTY */}

      {products.length === 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">
            No products found.
          </p>
        </div>
      )}

      {/* PRODUCT LIST */}

      {products.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(
            (product: Product) => {
              const primaryImage =
                product.images.find(
                  (image) =>
                    image.isPrimary,
                ) ??
                product.images[0];

              const displayPrice =
                product.salePrice ??
                product.price;

              const isDeleting =
                deleteMutation.isPending &&
                deleteMutation.variables ===
                  product.id;

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-square w-full bg-slate-100">
                    {primaryImage ? (
                      <Image
                        src={
                          primaryImage.imageUrl
                        }
                        alt={
                          product.name
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* INFO */}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="truncate text-lg font-semibold text-slate-900">
                        {
                          product.name
                        }
                      </h2>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize ${
                          product.status ===
                          "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {
                          product.status
                        }
                      </span>
                    </div>

                    {/* PRICE */}

                    <p className="mt-3 text-xl font-bold text-slate-900">
                      PKR{" "}
                      {Number(
                        displayPrice,
                      ).toLocaleString()}
                    </p>

                    {product.salePrice && (
                      <p className="text-sm text-slate-400 line-through">
                        PKR{" "}
                        {Number(
                          product.price,
                        ).toLocaleString()}
                      </p>
                    )}

                    {/* STOCK */}

                    <p className="mt-3 text-sm text-slate-500">
                      Stock:{" "}
                      <span className="font-medium text-slate-900">
                        {
                          product.stock
                        }
                      </span>
                    </p>

                    {/* ACTIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {/* EDIT */}

                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          isDeleting
                        }
                        onClick={() =>
                          router.push(
                            `/admin/products/${product.id}/edit`,
                          )
                        }
                      >
                        Edit
                      </Button>

                      {/* DELETE */}

                      <Button
                        type="button"
                        variant="danger"
                        disabled={
                          isDeleting
                        }
                        onClick={() =>
                          handleDeleteProduct(
                            product,
                          )
                        }
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* PAGINATION */}

      {pagination && (
        <Pagination
          currentPage={
            pagination.page
          }
          totalPages={
            pagination.totalPages
          }
          onPageChange={
            setPage
          }
        />
      )}
    </main>
  );
}