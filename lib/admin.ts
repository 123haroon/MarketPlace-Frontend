import api from "./api";
import type { User } from "./auth";

export type PaginationData = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
export type DeleteProductResponse = {
  message: string;
  data: {
    id: number;
    name: string;
  };
};


export type AdminUsersResponse = {
  users: User[];
  pagination: PaginationData;
};

export type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
};

// --------------------------------------------------
// ADMIN USERS WITH PAGINATION
// --------------------------------------------------

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
): Promise<AdminUsersResponse> {
  const response = await api.get<AdminUsersResponse>("/admin/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

// --------------------------------------------------
// DASHBOARD STATS
// --------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/admin/dashboard-stats");

  return response.data;
}
export async function deleteProduct(
  productId: number,
): Promise<DeleteProductResponse> {
  const response = await api.delete<DeleteProductResponse>(
    `/admin/products/${productId}`,
  );

  return response.data;
}