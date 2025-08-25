import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service";
import { ResponseUtil } from "../utils/response.util";

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  generateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, vehicleId } = req.query as {
        startDate: string;
        endDate: string;
        vehicleId?: string;
      };

      const vehicleIdNum = vehicleId ? parseInt(vehicleId) : undefined;
      const excelBuffer = await this.reportService.generateReport(
        startDate,
        endDate,
        vehicleIdNum
      );

      const filename = `vehicle-report-${startDate}-to-${endDate}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      res.send(excelBuffer);
    } catch (error) {
      next(error);
    }
  };

  getReportData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, vehicleId } = req.query as {
        startDate: string;
        endDate: string;
        vehicleId?: string;
      };

      const vehicleIdNum = vehicleId ? parseInt(vehicleId) : undefined;
      const reportData = await this.reportService.getReportData(
        startDate,
        endDate,
        vehicleIdNum
      );

      ResponseUtil.success(
        res,
        reportData,
        "Report data retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  };
}
