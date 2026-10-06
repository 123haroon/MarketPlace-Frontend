import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        {...props}
        className={`w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        } ${className}`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
