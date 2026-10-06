import api from "./api";

// ==================================================
// PRODUCT IMAGE
// ==================================================

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

// ==================================================
// PRODUCT
// ==================================================

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;

  price: string;
  salePrice: string | null;

  stock: number;
  status: "active" | "inactive";

  createdAt: string;
  updatedAt: string;

  images: ProductImage[];
};

// ==================================================
// CREATE PRODUCT
// ==================================================

export type CreateProductData = {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  status: "active" | "inactive";
  images: File[];
};

// ==================================================
// UPDATE PRODUCT
// ==================================================

export type UpdateProductData = {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  status: "active" | "inactive";

  // Newly selected images
  images: File[];

  // Existing image IDs removed by admin
  removedImageIds: number[];
};

// ==================================================
// PAGINATION
// ==================================================

export type PaginationData = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

// ==================================================
// API RESPONSE TYPES
// ==================================================

type ProductsResponse = {
  products: Product[];
};

type ProductResponse = {
  product: Product;
};

type CreateProductResponse = {
  message: string;
  product?: Product;
  data?: Product;
};

export type AdminProductsResponse = {
  products: Product[];
  pagination: PaginationData;
};

export type DeleteProductResponse = {
  message: string;

  data: {
    id: number;
    name: string;
  };
};

type AdminProductResponse = {
  product: Product;
};

type UpdateProductResponse = {
  message: string;
  product: Product;
};

// ==================================================
// GET PUBLIC PRODUCTS
// ==================================================

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ProductsResponse>("/products");

  return response.data.products;
}

// ==================================================
// GET PUBLIC PRODUCT BY SLUG
// ==================================================

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await api.get<ProductResponse>(`/products/${slug}`);

  return response.data.product;
}

// ==================================================
// CREATE PRODUCT
// ==================================================

export async function createProduct(data: CreateProductData): Promise<Product> {
  const formData = new FormData();

  formData.append("name", data.name);

  formData.append("description", data.description);

  formData.append("price", String(data.price));

  if (data.salePrice !== null) {
    formData.append("salePrice", String(data.salePrice));
  }

  formData.append("stock", String(data.stock));

  formData.append("status", data.status);

  // Maximum 3 images frontend/backend
  data.images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await api.post<CreateProductResponse>(
    "/admin/products",
    formData,
  );

  const product = response.data.product ?? response.data.data;

  if (!product) {
    throw new Error("Product created but product data was not returned");
  }

  return product;
}

// ==================================================
// ADMIN PRODUCTS WITH PAGINATION
// ==================================================

export async function getAdminProducts(
  page: number = 1,
  limit: number = 10,
): Promise<AdminProductsResponse> {
  const response = await api.get<AdminProductsResponse>("/admin/products", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

// ==================================================
// DELETE PRODUCT
// ==================================================

export async function deleteProduct(
  productId: number,
): Promise<DeleteProductResponse> {
  const response = await api.delete<DeleteProductResponse>(
    `/admin/products/${productId}`,
  );

  return response.data;
}

// ==================================================
// ADMIN GET SINGLE PRODUCT
// ==================================================

export async function getAdminProductById(productId: number): Promise<Product> {
  const response = await api.get<AdminProductResponse>(
    `/admin/products/${productId}`,
  );

  return response.data.product;
}

// ==================================================
// ADMIN UPDATE PRODUCT
// ==================================================

export async function updateProduct(
  productId: number,
  data: UpdateProductData,
): Promise<Product> {
  const formData = new FormData();

  // --------------------------------------------------
  // PRODUCT DATA
  // --------------------------------------------------

  formData.append("name", data.name);

  formData.append("description", data.description);

  formData.append("price", String(data.price));

  formData.append("stock", String(data.stock));

  formData.append("status", data.status);

  // --------------------------------------------------
  // SALE PRICE
  // --------------------------------------------------

  if (data.salePrice !== null) {
    formData.append("salePrice", String(data.salePrice));
  } else {
    formData.append("salePrice", "");
  }

  // --------------------------------------------------
  // REMOVED EXISTING IMAGES
  // --------------------------------------------------

  formData.append("removedImageIds", JSON.stringify(data.removedImageIds));

  // --------------------------------------------------
  // NEW IMAGES
  // --------------------------------------------------

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  // --------------------------------------------------
  // REQUEST
  // --------------------------------------------------

  const response = await api.patch<UpdateProductResponse>(
    `/admin/products/${productId}`,
    formData,
  );

  return response.data.product;
}
