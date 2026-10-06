"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

import Button from "@/components/ui/Butoon";
import Input from "@/components/ui/Input";

import { loginUser, type LoginData } from "../../lib/auth";

type ApiError = {
  message: string;
};

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // --------------------------------------------------
  // LOGIN MUTATION
  // --------------------------------------------------

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // Logged-in user ko React Query cache mein save karo
      queryClient.setQueryData(["currentUser"], data.user);

      setSuccessMessage("Login successful!");

      setTimeout(() => {
        if (data.user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      }, 1000);
    },
  });

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessMessage("");

    loginMutation.mutate(formData);
  }

  // --------------------------------------------------
  // ERROR MESSAGE
  // --------------------------------------------------

  let errorMessage = "";

  if (axios.isAxiosError<ApiError>(loginMutation.error)) {
    errorMessage =
      loginMutation.error.response?.data?.message || "Login failed";
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Login
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Login to your MarketStore account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* EMAIL */}

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* PASSWORD */}

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUCCESS */}

          {successMessage && (
            <p className="mt-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
              {successMessage}
            </p>
          )}

          {/* ERROR */}

          {loginMutation.isError && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* REUSABLE BUTTON */}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-5 w-full p-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          New to MarketStore?{" "}
          <Button
            type="button"
            onClick={() => router.push("/signup")}
            className="p-0 font-semibold text-slate-900 hover:underline"
          >
            Sign Up
          </Button>
        </p>
      </div>
    </main>
  );
}
