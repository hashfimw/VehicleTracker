export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "user";
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role?: "admin" | "user";
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  role?: "admin" | "user";
}
