import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Vehicle,
  VehicleStatus,
  VehicleWithLatestStatus,
  VehicleStatusQuery,
  PaginationQuery,
} from "@/types";

export const vehicleService = {
  async getVehicles(params?: PaginationQuery & { search?: string }): Promise<{
    vehicles: VehicleWithLatestStatus[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get(API_ENDPOINTS.VEHICLES.BASE, { params });
      const responseData = response.data;
      if (responseData && responseData.success && responseData.data) {
        const result = {
          vehicles: responseData.data,
          pagination: responseData.pagination,
        };
        return result;
      }

      return {
        vehicles: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error("Error in getVehicles:", error);
      throw error;
    }
  },

  async getVehicleById(id: number): Promise<Vehicle> {
    try {
      const response = await api.get(API_ENDPOINTS.VEHICLES.BY_ID(id));
      const responseData = response.data;

      let result;

      if (responseData && responseData.success && responseData.data) {
        result = responseData.data;
      } else if (responseData && typeof responseData === "object") {
      } else {
        throw new Error("Invalid vehicle data received");
      }
      return result;
    } catch (error) {
      console.error("Error in getVehicleById:", error);
      throw error;
    }
  },

  async getVehicleStatus(params: VehicleStatusQuery): Promise<VehicleStatus[]> {
    try {
      const { vehicleId, ...queryParams } = params;
      const response = await api.get(API_ENDPOINTS.VEHICLES.STATUS(vehicleId), {
        params: queryParams,
      });
      const responseData = response.data;

      let result;

      if (responseData && responseData.success && responseData.data) {
        if (
          responseData.data.statuses &&
          Array.isArray(responseData.data.statuses)
        ) {
          result = responseData.data.statuses;
        } else if (Array.isArray(responseData.data)) {
          result = responseData.data;
        } else {
          result = [];
        }
      } else if (Array.isArray(responseData)) {
        result = responseData;
      } else if (responseData) {
        result = responseData.data || responseData || [];
      } else {
        result = [];
      }
      return result;
    } catch (error) {
      console.error("Error in getVehicleStatus:", error);
      throw error;
    }
  },
};
