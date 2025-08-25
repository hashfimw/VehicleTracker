export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  role?: 'admin' | 'user';
}
