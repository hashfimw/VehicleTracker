import { api, handleApiResponse } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { VehicleReportData } from "@/types";
import { downloadBlob } from "@/lib/utils";

export interface ReportQuery {
  vehicleIds?: number[];
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const reportService = {
  async getReportData(params: ReportQuery): Promise<VehicleReportData[]> {
    const response = await api.get(API_ENDPOINTS.REPORTS.DATA, { params });
    return handleApiResponse(response);
  },

  async downloadReport(params: ReportQuery): Promise<void> {
    const response = await api.get(API_ENDPOINTS.REPORTS.DOWNLOAD, {
      params,
      responseType: "blob",
    });

    const filename = `vehicle-report-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    downloadBlob(response.data, filename);
  },
};
