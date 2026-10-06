"use client";

import { useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/auth";

export default function withAdmin<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  function AdminProtectedComponent(props: P) {
    const router = useRouter();

    const { data: user, isPending } = useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false,
    });

    useEffect(() => {
      if (isPending) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role !== "admin") {
        router.replace("/");
      }
    }, [user, isPending, router]);

    if (isPending) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-600">Checking admin access...</p>
        </div>
      );
    }

    if (!user || user.role !== "admin") {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  return AdminProtectedComponent;
}
