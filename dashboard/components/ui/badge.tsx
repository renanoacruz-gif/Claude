import { clsx } from "clsx";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "active" | "inactive" | "expired" | "expiring" | "default";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-green-100 text-green-800": variant === "active",
          "bg-gray-100 text-gray-600": variant === "inactive",
          "bg-red-100 text-red-700": variant === "expired",
          "bg-yellow-100 text-yellow-800": variant === "expiring",
          "bg-blue-100 text-blue-700": variant === "default",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
