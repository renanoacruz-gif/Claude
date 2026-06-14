import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500":
              variant === "primary",
            "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400":
              variant === "secondary",
            "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500":
              variant === "danger",
            "hover:bg-gray-100 text-gray-700 focus:ring-gray-400":
              variant === "ghost",
            "px-2.5 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
