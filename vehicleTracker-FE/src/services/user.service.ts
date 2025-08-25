import { api, handleApiResponse } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationQuery,
} from "@/types";

export const userService = {
  async getUsers(params?: PaginationQuery): Promise<{
    users: UserResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get(API_ENDPOINTS.USERS.BASE, { params });

    if (!response.data.success) {
      throw new Error(response.data.message || "Something went wrong");
    }

    return {
      users: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async getUserById(id: number): Promise<UserResponse> {
    const response = await api.get(API_ENDPOINTS.USERS.BY_ID(id));
    const apiResponse = handleApiResponse<UserResponse>(response);
    return apiResponse;
  },

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const response = await api.post(API_ENDPOINTS.USERS.BASE, data);
    const apiResponse = handleApiResponse<UserResponse>(response);
    return apiResponse;
  },

  async updateUser(id: number, data: UpdateUserRequest): Promise<UserResponse> {
    const response = await api.put(API_ENDPOINTS.USERS.BY_ID(id), data);
    const apiResponse = handleApiResponse<UserResponse>(response);
    return apiResponse;
  },

  async deleteUser(id: number): Promise<void> {
    const response = await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
    handleApiResponse<void>(response);
  },
};
