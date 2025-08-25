import ExcelJS from "exceljs";
import { VehicleReportData } from "../types/vehicle.types";

export class ExcelUtil {
  static async generateVehicleReport(
    reportData: VehicleReportData[]
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const summaryWorksheet = workbook.addWorksheet("Summary");
    summaryWorksheet.columns = [
      { header: "Vehicle", key: "vehicle", width: 20 },
      { header: "License Plate", key: "licensePlate", width: 15 },
      { header: "Brand", key: "brand", width: 15 },
      { header: "Model", key: "model", width: 15 },
      { header: "Total Trips", key: "totalTrips", width: 12 },
      { header: "Total Distance (km)", key: "totalDistance", width: 18 },
      { header: "Average Speed (km/h)", key: "averageSpeed", width: 18 },
      { header: "Idle Time (min)", key: "totalIdleTime", width: 15 },
      { header: "Stopped Time (min)", key: "totalStoppedTime", width: 18 },
    ];

    reportData.forEach((data) => {
      summaryWorksheet.addRow({
        vehicle: `${data.vehicle.brand} ${data.vehicle.model}`,
        licensePlate: data.vehicle.licensePlate,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        totalTrips: data.summary.totalTrips,
        totalDistance: data.summary.totalDistance,
        averageSpeed: data.summary.averageSpeed,
        totalIdleTime: data.summary.totalIdleTime,
        totalStoppedTime: data.summary.totalStoppedTime,
      });
    });

    summaryWorksheet.getRow(1).font = { bold: true };
    summaryWorksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };
    reportData.forEach((data, index) => {
      let worksheetName = `${data.vehicle.licensePlate}`;

      if (!worksheetName || worksheetName.trim() === "") {
        worksheetName = `Vehicle_${index + 1}`;
      }

      worksheetName = worksheetName
        .replace(/[\\\/\?\*\[\]]/g, "_")
        .substring(0, 31);

      let finalName = worksheetName;
      let counter = 1;
      while (workbook.worksheets.some((ws) => ws.name === finalName)) {
        const suffix = `_${counter}`;
        finalName = worksheetName.substring(0, 31 - suffix.length) + suffix;
        counter++;
      }

      const detailWorksheet = workbook.addWorksheet(finalName);

      detailWorksheet.columns = [
        { header: "Timestamp", key: "timestamp", width: 20 },
        { header: "Status", key: "status", width: 10 },
        { header: "Latitude", key: "latitude", width: 12 },
        { header: "Longitude", key: "longitude", width: 12 },
        { header: "Speed (km/h)", key: "speed", width: 12 },
        { header: "Fuel Level (%)", key: "fuelLevel", width: 15 },
        { header: "Engine Temp (°C)", key: "engineTemp", width: 16 },
      ];

      data.statuses.forEach((status) => {
        detailWorksheet.addRow({
          timestamp: new Date(status.timestamp).toLocaleString(),
          status: status.status,
          latitude: status.latitude,
          longitude: status.longitude,
          speed: status.speed,
          fuelLevel: status.fuelLevel,
          engineTemp: status.engineTemp,
        });
      });

      detailWorksheet.getRow(1).font = { bold: true };
      detailWorksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
