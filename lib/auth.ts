import axios from "axios";
import api from "./api";

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

export type AuthResponse = {
  message: string;
  user: User;
};

// Signup
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signup", data);

  return response.data;
}

// Login
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
}

// Current logged-in user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<{ user: User }>("/auth/me");

    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

// Logout
export async function logoutUser() {
  const response = await api.post("/auth/logout");

  return response.data;
}
