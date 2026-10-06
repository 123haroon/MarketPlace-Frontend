"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { useParams, useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Butoon";

import Select from "@/app/admin/component/ui/Select";
import Textarea from "@/app/admin/component/ui/Textarea";

import {
  getAdminProductById,
  updateProduct,
  type UpdateProductData,
} from "@/lib/products";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ProductForm = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  status: "active" | "inactive";
};

// --------------------------------------------------
// PAGE
// --------------------------------------------------

export default function EditProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const params = useParams<{ id: string }>();

  const productId = Number(params.id);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    status: "active",
  });

  // --------------------------------------------------
  // NEW IMAGES
  // --------------------------------------------------

  const [images, setImages] = useState<File[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // --------------------------------------------------
  // REMOVED EXISTING IMAGES
  // --------------------------------------------------

  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  // --------------------------------------------------
  // GET PRODUCT
  // --------------------------------------------------

  const {
    data: product,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["admin-product", productId],

    queryFn: () => getAdminProductById(productId),

    enabled: Number.isInteger(productId) && productId > 0,
  });

  // --------------------------------------------------
  // FILL EXISTING PRODUCT DATA
  // --------------------------------------------------

  useEffect(() => {
    if (!product) {
      return;
    }

    setFormData({
      name: product.name,

      description: product.description ?? "",

      price: product.price,

      salePrice: product.salePrice ?? "",

      stock: String(product.stock),

      status: product.status,
    });
  }, [product]);

  // --------------------------------------------------
  // EXISTING IMAGES AFTER REMOVALS
  // --------------------------------------------------

  const existingImages =
    product?.images.filter((image) => !removedImageIds.includes(image.id)) ??
    [];

  // Existing DB images + newly selected files
  const totalImages = existingImages.length + images.length;

  // --------------------------------------------------
  // UPDATE PRODUCT
  // --------------------------------------------------

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductData) => updateProduct(productId, data),

    onSuccess: async () => {
      toast.success("Product updated successfully");

      // Cleanup local preview URLs
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin-product", productId],
        }),

        // Public product detail queries
        queryClient.invalidateQueries({
          queryKey: ["product"],
        }),
      ]);

      router.push("/admin/products");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product",
      );
    },
  });

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // --------------------------------------------------
  // ADD NEW IMAGES
  // --------------------------------------------------

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    // --------------------------------
    // FILE TYPES
    // --------------------------------

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFile) {
      toast.error("Only JPG, PNG and WEBP images are allowed");

      event.target.value = "";

      return;
    }

    // --------------------------------
    // FILE SIZE
    // --------------------------------

    const largeFile = selectedFiles.find((file) => file.size > 5 * 1024 * 1024);

    if (largeFile) {
      toast.error("Each image must be 5 MB or smaller");

      event.target.value = "";

      return;
    }

    // --------------------------------
    // REMOVE DUPLICATES
    // --------------------------------

    const uniqueSelectedFiles = selectedFiles.filter((file, index, array) => {
      const duplicateInCurrentImages = images.some(
        (currentImage) =>
          currentImage.name === file.name && currentImage.size === file.size,
      );

      const firstIndexInSelection = array.findIndex(
        (item) => item.name === file.name && item.size === file.size,
      );

      return !duplicateInCurrentImages && firstIndexInSelection === index;
    });

    if (uniqueSelectedFiles.length === 0) {
      toast.error("Image already selected");

      event.target.value = "";

      return;
    }

    // --------------------------------
    // MAXIMUM 3 IMAGES
    // --------------------------------

    const futureTotal =
      existingImages.length + images.length + uniqueSelectedFiles.length;

    if (futureTotal > 3) {
      toast.error("Maximum 3 product images are allowed");

      event.target.value = "";

      return;
    }

    // --------------------------------
    // ADD FILES
    // --------------------------------

    setImages((current) => [...current, ...uniqueSelectedFiles]);

    const newPreviews = uniqueSelectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setImagePreviews((current) => [...current, ...newPreviews]);

    // Reset input so admin can select
    // another image using same input
    event.target.value = "";
  }

  // --------------------------------------------------
  // REMOVE EXISTING IMAGE
  // --------------------------------------------------

  function handleRemoveExistingImage(imageId: number) {
    if (totalImages <= 1) {
      toast.error("Product must have at least one image");

      return;
    }

    setRemovedImageIds((current) => {
      if (current.includes(imageId)) {
        return current;
      }

      return [...current, imageId];
    });
  }

  // --------------------------------------------------
  // REMOVE NEW IMAGE
  // --------------------------------------------------

  function handleRemoveNewImage(indexToRemove: number) {
    const preview = imagePreviews[indexToRemove];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImages((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );

    setImagePreviews((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // --------------------------------
    // NAME
    // --------------------------------

    if (!formData.name.trim()) {
      toast.error("Product name is required");

      return;
    }

    // --------------------------------
    // PRICE
    // --------------------------------

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Valid price is required");

      return;
    }

    // --------------------------------
    // STOCK
    // --------------------------------

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      toast.error("Stock must be a valid whole number");

      return;
    }

    // --------------------------------
    // SALE PRICE
    // --------------------------------

    if (
      formData.salePrice &&
      Number(formData.salePrice) > Number(formData.price)
    ) {
      toast.error("Sale price cannot be greater than regular price");

      return;
    }

    if (formData.salePrice && Number(formData.salePrice) < 0) {
      toast.error("Sale price cannot be negative");

      return;
    }

    // --------------------------------
    // IMAGES
    // --------------------------------

    if (totalImages === 0) {
      toast.error("Product must have at least one image");

      return;
    }

    if (totalImages > 3) {
      toast.error("Maximum 3 product images are allowed");

      return;
    }

    // --------------------------------
    // MUTATION
    // --------------------------------

    updateMutation.mutate({
      name: formData.name.trim(),

      description: formData.description.trim(),

      price: Number(formData.price),

      salePrice: formData.salePrice === "" ? null : Number(formData.salePrice),

      stock: Number(formData.stock),

      status: formData.status,

      // Newly selected files
      images,

      // Existing DB image IDs
      // selected for deletion
      removedImageIds,
    });
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isPending) {
    return (
      <main className="p-6">
        <p className="text-sm text-slate-500">Loading product...</p>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (isError || !product) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">Failed to load product.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      <div className="mx-auto max-w-4xl">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            ← Back to Products
          </Button>

          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update product details and manage product images.
          </p>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* NAME */}

            <div className="sm:col-span-2">
              <Input
                id="name"
                label="Product Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PRICE */}

            <Input
              id="price"
              label="Price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />

            {/* SALE PRICE */}

            <Input
              id="salePrice"
              label="Sale Price"
              name="salePrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.salePrice}
              onChange={handleChange}
            />

            {/* STOCK */}

            <Input
              id="stock"
              label="Stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            {/* STATUS */}

            <Select
              id="status"
              label="Status"
              value={formData.status}
              options={[
                {
                  label: "Active",
                  value: "active",
                },
                {
                  label: "Inactive",
                  value: "inactive",
                },
              ]}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,

                  status: event.target.value as "active" | "inactive",
                }))
              }
            />

            {/* DESCRIPTION */}

            <div className="sm:col-span-2">
              <Textarea
                id="description"
                label="Description"
                rows={5}
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,

                    description: event.target.value,
                  }))
                }
              />
            </div>

            {/* ======================================
                ADD NEW IMAGES
            ====================================== */}

            <div className="sm:col-span-2">
              <Input
                id="images"
                label="Add Product Images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
              />

              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>Add images one by one or select multiple images.</p>

                <p className="font-semibold text-slate-700">
                  {totalImages}/3 images
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Maximum 3 images. JPG, PNG or WEBP. Maximum 5 MB each.
              </p>
            </div>
          </div>

          {/* ==========================================
              EXISTING IMAGES
          ========================================== */}

          {existingImages.length > 0 && (
            <div className="mt-7">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Current Images
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Remove any image you no longer want.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {existingImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-square bg-slate-100">
                      <img
                        src={image.imageUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {/* FIRST REMAINING IMAGE */}

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                          Main Image
                        </span>
                      )}

                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700 shadow">
                        {index + 1}
                      </span>
                    </div>

                    {/* REMOVE */}

                    <div className="p-3">
                      <Button
                        type="button"
                        variant="danger"
                        disabled={updateMutation.isPending}
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              NEW IMAGES
          ========================================== */}

          {imagePreviews.length > 0 && (
            <div className="mt-7">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  New Images
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  These images will be added when you save changes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => {
                  const becomesMain =
                    existingImages.length === 0 && index === 0;

                  return (
                    <div
                      key={preview}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-square bg-slate-100">
                        <img
                          src={preview}
                          alt={`New product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {becomesMain && (
                          <span className="absolute left-2 top-2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                            Main Image
                          </span>
                        )}

                        <span className="absolute right-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                          New
                        </span>
                      </div>

                      {/* INFO */}

                      <div className="p-3">
                        <p className="truncate text-xs text-slate-500">
                          {images[index]?.name}
                        </p>

                        <Button
                          type="button"
                          variant="danger"
                          disabled={updateMutation.isPending}
                          onClick={() => handleRemoveNewImage(index)}
                          className="mt-3 w-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              IMAGE SUMMARY
          ========================================== */}

          <div className="mt-7 rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Product Images
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Existing: {existingImages.length} · New: {images.length}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  totalImages === 3
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {totalImages}/3
              </span>
            </div>
          </div>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={updateMutation.isPending}
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
