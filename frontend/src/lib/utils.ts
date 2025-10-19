import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timeStamp: string) => {
  const n = timeStamp ? Number(timeStamp) : NaN;
  return Number.isFinite(n) ? new Date(n).toLocaleString() : "—";
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
