import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatSpeed = (speed: number) => {
  return `${speed.toFixed(1)} km/h`;
};

export const formatFuelLevel = (level: number) => {
  return `${level.toFixed(1)}%`;
};

export const formatEngineTemp = (temp: number) => {
  return `${temp}°C`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "trip":
      return "bg-green-100 text-green-800 border-green-200";
    case "idle":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "stopped":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "trip":
      return "bg-green-500";
    case "idle":
      return "bg-yellow-500";
    case "stopped":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
