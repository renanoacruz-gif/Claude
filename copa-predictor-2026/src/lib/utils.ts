import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pct(n: number, decimals = 1) {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function fmt(n: number, decimals = 2) {
  return n.toFixed(decimals);
}
