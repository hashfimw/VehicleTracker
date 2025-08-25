export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: number) => `/users/${id}`,
  },
  VEHICLES: {
    BASE: "/vehicles",
    BY_ID: (id: number) => `/vehicles/${id}`,
    STATUS: (id: number) => `/vehicles/${id}/status`,
  },
  REPORTS: {
    DATA: "/reports/data",
    DOWNLOAD: "/reports/download",
  },
} as const;

export const QUERY_KEYS = {
  AUTH: ["auth"],
  USERS: ["users"],
  VEHICLES: ["vehicles"],
  VEHICLE_STATUS: ["vehicle-status"],
  REPORTS: ["reports"],
} as const;

export const FUEL_TYPES = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const USER_ROLES = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
] as const;

export const VEHICLE_STATUS_OPTIONS = [
  { value: "trip", label: "Trip" },
  { value: "idle", label: "Idle" },
  { value: "stopped", label: "Stopped" },
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 5,
};
