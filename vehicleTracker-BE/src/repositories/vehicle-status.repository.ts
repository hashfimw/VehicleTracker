import { db } from "../config/database";
import { VehicleStatus, VehicleStatusQuery } from "../types/vehicle.types";

export class VehicleStatusRepository {
  async findByVehicleAndDateRange(
    query: VehicleStatusQuery
  ): Promise<VehicleStatus[]> {
    const { vehicleId, date, startDate, endDate } = query;

    let whereClause = "WHERE vehicle_id = $1";
    const queryParams: any[] = [vehicleId];
    let paramCount = 2;

    if (date) {
      whereClause += ` AND DATE(timestamp) = $${paramCount}`;
      queryParams.push(date);
      paramCount++;
    } else if (startDate && endDate) {
      whereClause += ` AND DATE(timestamp) >= $${paramCount} AND DATE(timestamp) <= $${paramCount + 1}`;
      queryParams.push(startDate, endDate);
      paramCount += 2;
    } else if (startDate) {
      whereClause += ` AND DATE(timestamp) >= $${paramCount}`;
      queryParams.push(startDate);
      paramCount++;
    } else if (endDate) {
      whereClause += ` AND DATE(timestamp) <= $${paramCount}`;
      queryParams.push(endDate);
      paramCount++;
    }

    const sqlQuery = `
      SELECT id, vehicle_id, status, latitude, longitude, speed, fuel_level, 
             engine_temp, timestamp, created_at
      FROM vehicle_statuses 
      ${whereClause}
      ORDER BY timestamp ASC
    `;

    const result = await db.query(sqlQuery, queryParams);

    return result.rows.map((row: any) => ({
      id: row.id,
      vehicleId: row.vehicle_id,
      status: row.status,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      speed: parseFloat(row.speed),
      fuelLevel: parseFloat(row.fuel_level),
      engineTemp: row.engine_temp,
      timestamp: row.timestamp,
      createdAt: row.created_at,
    }));
  }

  async findLatestByVehicle(vehicleId: number): Promise<VehicleStatus | null> {
    const query = `
      SELECT id, vehicle_id, status, latitude, longitude, speed, fuel_level, 
             engine_temp, timestamp, created_at
      FROM vehicle_statuses 
      WHERE vehicle_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;

    const result = await db.query(query, [vehicleId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      vehicleId: row.vehicle_id,
      status: row.status,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      speed: parseFloat(row.speed),
      fuelLevel: parseFloat(row.fuel_level),
      engineTemp: row.engine_temp,
      timestamp: row.timestamp,
      createdAt: row.created_at,
    };
  }

  async findForReport(
    vehicleIds?: number[],
    startDate?: string,
    endDate?: string
  ): Promise<
    {
      vehicleId: number;
      statuses: VehicleStatus[];
    }[]
  > {
    let whereClause = "";
    const queryParams: any[] = [];
    let paramCount = 1;

    const conditions: string[] = [];

    if (vehicleIds && vehicleIds.length > 0) {
      const placeholders = vehicleIds.map(() => `$${paramCount++}`).join(",");
      conditions.push(`vehicle_id IN (${placeholders})`);
      queryParams.push(...vehicleIds);
    }

    if (startDate) {
      conditions.push(`DATE(timestamp) >= $${paramCount++}`);
      queryParams.push(startDate);
    }

    if (endDate) {
      conditions.push(`DATE(timestamp) <= $${paramCount++}`);
      queryParams.push(endDate);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    const query = `
      SELECT vehicle_id, id, status, latitude, longitude, speed, fuel_level, 
             engine_temp, timestamp, created_at
      FROM vehicle_statuses 
      ${whereClause}
      ORDER BY vehicle_id, timestamp ASC
    `;

    const result = await db.query(query, queryParams);
    const groupedData = new Map<number, VehicleStatus[]>();
    result.rows.forEach((row: any) => {
      const vehicleId = row.vehicle_id;
      const status: VehicleStatus = {
        id: row.id,
        vehicleId: row.vehicle_id,
        status: row.status,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        speed: parseFloat(row.speed),
        fuelLevel: parseFloat(row.fuel_level),
        engineTemp: row.engine_temp,
        timestamp: row.timestamp,
        createdAt: row.created_at,
      };

      if (!groupedData.has(vehicleId)) {
        groupedData.set(vehicleId, []);
      }
      groupedData.get(vehicleId)!.push(status);
    });

    return Array.from(groupedData.entries()).map(([vehicleId, statuses]) => ({
      vehicleId,
      statuses,
    }));
  }

  async getStatusSummary(
    vehicleId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalTrips: number;
    totalIdleTime: number;
    totalStoppedTime: number;
    totalDistance: number;
    averageSpeed: number;
  }> {
    let whereClause = "WHERE vehicle_id = $1";
    const queryParams: any[] = [vehicleId];
    let paramCount = 2;

    if (startDate && endDate) {
      whereClause += ` AND DATE(timestamp) >= $${paramCount} AND DATE(timestamp) <= $${paramCount + 1}`;
      queryParams.push(startDate, endDate);
      paramCount += 2;
    }

    const statuses = await this.findByVehicleAndDateRange({
      vehicleId,
      startDate,
      endDate,
    });

    let totalTrips = 0;
    let totalIdleTime = 0;
    let totalStoppedTime = 0;
    let totalDistance = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    let currentTripStart: Date | null = null;
    let lastPosition: { lat: number; lng: number } | null = null;

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      const nextStatus = statuses[i + 1];

      if (status && status.status === "trip") {
        if (!currentTripStart) {
          currentTripStart = new Date(status.timestamp);
          totalTrips++;
        }

        if (status.speed > 0) {
          totalSpeed += status.speed;
          speedCount++;
        }
        if (lastPosition) {
          const distance = this.calculateDistance(
            lastPosition.lat,
            lastPosition.lng,
            status.latitude,
            status.longitude
          );
          totalDistance += distance;
        }
      } else {
        currentTripStart = null;
      }

      if (nextStatus && status && status.status !== "trip") {
        const timeDiff =
          new Date(nextStatus.timestamp).getTime() -
          new Date(status.timestamp).getTime();
        const minutes = timeDiff / (1000 * 60);

        if (status.status === "idle") {
          totalIdleTime += minutes;
        } else if (status.status === "stopped") {
          totalStoppedTime += minutes;
        }
      }

      if (status) {
        lastPosition = { lat: status.latitude, lng: status.longitude };
      }
    }

    return {
      totalTrips,
      totalIdleTime: Math.round(totalIdleTime),
      totalStoppedTime: Math.round(totalStoppedTime),
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageSpeed:
        speedCount > 0 ? Math.round((totalSpeed / speedCount) * 100) / 100 : 0,
    };
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
