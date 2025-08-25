import { useQuery } from "@tanstack/react-query";
import { vehicleService } from "@/services";
import { QUERY_KEYS } from "@/lib/constants";
import { PaginationQuery, VehicleStatusQuery } from "@/types";

export const useVehicles = (params?: PaginationQuery & { search?: string }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLES, params],
    queryFn: async () => {
      try {
        const result = await vehicleService.getVehicles(params);
        return result;
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60, 
    retry: 2,
  });
};

export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLES, id],
    queryFn: async () => {
      try {
        return await vehicleService.getVehicleById(id);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
  });
};

export const useVehicleStatus = (params: VehicleStatusQuery) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.VEHICLE_STATUS, params],
    queryFn: async () => {
      try {
        return await vehicleService.getVehicleStatus(params);
      } catch (error) {
        console.error("Error fetching vehicle status:", error);
        throw error;
      }
    },
    enabled: !!params.vehicleId,
    retry: 2,
  });
};
