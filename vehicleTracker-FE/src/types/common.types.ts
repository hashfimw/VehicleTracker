export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
