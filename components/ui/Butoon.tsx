import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "secondary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300",

    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",

    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-200",

    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
  };

  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        rounded-lg
        px-4 py-2.5
        text-sm font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
