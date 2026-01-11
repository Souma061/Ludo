// Math: getGlobalIndex(player,step)
// src/utils/helpers.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely.
 * * @param inputs - List of classes or conditional objects
 * @returns A single string of optimized classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
