import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "MarketStore",
  description: "Full stack ecommerce application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <QueryProvider>
          <Navbar />

          {children}
          <ToastContainer position="top-right" autoClose={3000} newestOnTop />
        </QueryProvider>
      </body>
    </html>
  );
}
