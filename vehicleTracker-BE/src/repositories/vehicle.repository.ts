import { db } from "../config/database";
import { Vehicle, VehicleWithLatestStatus } from "../types/vehicle.types";
import { PaginationQuery } from "../types/common.types";

export class VehicleRepository {
  async findById(id: number): Promise<Vehicle | null> {
    const query = `
      SELECT id, license_plate, brand, model, year, color, fuel_type, created_at, updated_at 
      FROM vehicles 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(pagination: PaginationQuery & { search?: string }): Promise<{
    vehicles: VehicleWithLatestStatus[];
    total: number;
  }> {
    const { page = 1, limit = 10, search } = pagination;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams: any[] = [];
    let paramCount = 1;

    if (search) {
      whereClause = `WHERE (v.license_plate ILIKE $${paramCount} OR v.brand ILIKE $${paramCount} OR v.model ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM vehicles v ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    queryParams.push(limit, offset);
    const query = `
      SELECT 
        v.id, v.license_plate, v.brand, v.model, v.year, v.color, v.fuel_type, 
        v.created_at, v.updated_at,
        vs.id as status_id, vs.status, vs.latitude, vs.longitude, vs.speed, 
        vs.fuel_level, vs.engine_temp, vs.timestamp as status_timestamp
      FROM vehicles v
      LEFT JOIN LATERAL (
        SELECT * FROM vehicle_statuses 
        WHERE vehicle_id = v.id 
        ORDER BY timestamp DESC 
        LIMIT 1
      ) vs ON true
      ${whereClause}
      ORDER BY v.created_at DESC 
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;

    const result = await db.query(query, queryParams);

    const vehicles = result.rows.map((row: any) => ({
      id: row.id,
      licensePlate: row.license_plate,
      brand: row.brand,
      model: row.model,
      year: row.year,
      color: row.color,
      fuelType: row.fuel_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      latestStatus: row.status_id
        ? {
            id: row.status_id,
            vehicleId: row.id,
            status: row.status,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            speed: parseFloat(row.speed),
            fuelLevel: parseFloat(row.fuel_level),
            engineTemp: row.engine_temp,
            timestamp: row.status_timestamp,
            createdAt: row.status_timestamp,
          }
        : undefined,
    }));

    return { vehicles, total };
  }
}
