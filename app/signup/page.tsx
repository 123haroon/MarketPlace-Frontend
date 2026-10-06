"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

import Button from "@/components/ui/Butoon";
import Input from "@/components/ui/Input";

import { signupUser, type SignupData } from "../../lib/auth";

type ApiError = {
  message: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,

    onSuccess: () => {
      setSuccessMessage("You are registered successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    },
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    signupMutation.mutate(formData);
  }

  let errorMessage = "";

  if (axios.isAxiosError<ApiError>(signupMutation.error)) {
    errorMessage =
      signupMutation.error.response?.data?.message || "Signup failed";
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded border bg-white p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Create Account</h1>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="mb-4"
            required
          />

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="mb-4"
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="mb-4"
            required
          />

          {signupMutation.isError && (
            <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full rounded bg-black p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signupMutation.isPending ? "Creating account..." : "Signup"}
          </Button>
        </form>
      </div>
    </main>
  );
}
