import { useQuery, useMutation } from "@tanstack/react-query";
import { reportService } from "@/services";
import { QUERY_KEYS } from "@/lib/constants";
import { ReportQuery } from "@/services/report.service";

export const useReportData = (params: ReportQuery) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, "data", params],
    queryFn: () => reportService.getReportData(params),
    enabled: !!(params.startDate && params.endDate),
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (params: ReportQuery) => reportService.downloadReport(params),
    onSuccess: () => {
      console.log("Report downloaded successfully");
    },
    onError: (error) => {
      console.error("Failed to download report:", error);
    },
  });
};
