"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Butoon";

import Textarea from "../../component/ui/Textarea";
import Select from "../../component/ui/Select";

import { createProduct, type CreateProductData } from "@/lib/products";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type ApiError = {
  message: string;
};

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

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
  // IMAGES
  // --------------------------------------------------

  const [images, setImages] = useState<File[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // --------------------------------------------------
  // CREATE PRODUCT
  // --------------------------------------------------

  const createMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: async () => {
      toast.success("Product added successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin", "dashboardStats"],
        }),
      ]);

      router.push("/admin/products");
    },

    onError: (error) => {
      if (axios.isAxiosError<ApiError>(error)) {
        toast.error(error.response?.data?.message ?? "Failed to add product");

        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to add product",
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
  // IMAGE CHANGE
  // --------------------------------------------------

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    // Invalid type check
    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFile) {
      toast.error("Only JPG, PNG and WEBP images are allowed");

      event.target.value = "";

      return;
    }

    // Size check
    const largeFile = selectedFiles.find((file) => file.size > 5 * 1024 * 1024);

    if (largeFile) {
      toast.error("Each image must be 5 MB or smaller");

      event.target.value = "";

      return;
    }

    // Existing + newly selected images
    const combinedImages = [...images, ...selectedFiles];

    // Maximum 3
    if (combinedImages.length > 3) {
      toast.error("Maximum 3 product images are allowed");

      event.target.value = "";

      return;
    }

    // Duplicate image avoid
    const uniqueImages = combinedImages.filter(
      (file, index, array) =>
        index ===
        array.findIndex(
          (item) => item.name === file.name && item.size === file.size,
        ),
    );

    setImages(uniqueImages);

    // Create previews only for newly selected files
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setImagePreviews((current) => [...current, ...newPreviews]);

    // Important:
    // input reset so admin can select another image
    event.target.value = "";
  }

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  function handleRemoveImage(indexToRemove: number) {
    const previewToRemove = imagePreviews[indexToRemove];

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
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

    // Name
    if (!formData.name.trim()) {
      toast.error("Product name is required");

      return;
    }

    // Price
    if (!formData.price) {
      toast.error("Product price is required");

      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");

      return;
    }

    // Stock
    if (formData.stock === "") {
      toast.error("Stock quantity is required");

      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      toast.error("Stock must be a valid whole number");

      return;
    }

    // Sale price
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

    // Images
    if (images.length === 0) {
      toast.error("Please select at least one product image");

      return;
    }

    if (images.length > 3) {
      toast.error("Maximum 3 product images are allowed");

      return;
    }

    // --------------------------------------------------
    // PRODUCT DATA
    // --------------------------------------------------

    const productData: CreateProductData = {
      name: formData.name.trim(),

      description: formData.description.trim(),

      price: Number(formData.price),

      salePrice: formData.salePrice === "" ? null : Number(formData.salePrice),

      stock: Number(formData.stock),

      status: formData.status,

      images,
    };

    createMutation.mutate(productData);
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
            className="mb-4 px-4 py-2"
          >
            ← Back to Products
          </Button>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new product to MarketStore.
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
            {/* PRODUCT NAME */}

            <div className="sm:col-span-2">
              <Input
                id="name"
                label="Product Name"
                name="name"
                type="text"
                placeholder="Enter product name"
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
              placeholder="Enter price"
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
              placeholder="Optional sale price"
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
              placeholder="Enter stock"
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
                name="description"
                rows={5}
                placeholder="Enter product description"
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
                PRODUCT IMAGES
            ====================================== */}

            <div className="sm:col-span-2">
              <Input
                id="images"
                label="Product Images"
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
              />

              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>Upload up to 3 images. JPG, PNG or WEBP.</p>

                <p className="font-medium">{images.length}/3 selected</p>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                The first selected image will be used as the main product image.
              </p>
            </div>
          </div>

          {/* ==========================================
              IMAGE PREVIEWS
          ========================================== */}

          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Selected Images
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  First image will appear as the primary image on product cards.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-square bg-slate-100">
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {/* MAIN BADGE */}

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                          Main Image
                        </span>
                      )}

                      {/* IMAGE NUMBER */}

                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700 shadow">
                        {index + 1}
                      </span>
                    </div>

                    {/* IMAGE INFO */}

                    <div className="p-3">
                      <p className="truncate text-xs text-slate-500">
                        {images[index]?.name}
                      </p>

                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveImage(index)}
                        className="mt-3 w-full px-3 py-2 text-xs"
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
              ACTIONS
          ========================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              disabled={createMutation.isPending}
              onClick={() => router.push("/admin/products")}
              className="px-5 py-3"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending}
              className="px-6 py-3"
            >
              {createMutation.isPending ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
