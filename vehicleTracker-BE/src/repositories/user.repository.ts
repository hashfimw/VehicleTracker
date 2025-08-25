import { db } from "../config/database";
import {
  User,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user.types";
import { PaginationQuery } from "../types/common.types";

export class UserRepository {
  async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, full_name, role, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password, full_name, role, created_at, updated_at 
      FROM users 
      WHERE email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async findByEmailForAuth(email: string): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, full_name, role, created_at, updated_at 
      FROM users 
      WHERE email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async create(userData: CreateUserRequest): Promise<UserResponse> {
    const query = `
      INSERT INTO users (email, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, role, created_at, updated_at
    `;
    const result = await db.query(query, [
      userData.email,
      userData.password,
      userData.fullName,
      userData.role || "user",
    ]);
    return result.rows[0];
  }

  async update(
    id: number,
    userData: UpdateUserRequest
  ): Promise<UserResponse | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userData.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.fullName) {
      fields.push(`full_name = $${paramCount++}`);
      values.push(userData.fullName);
    }
    if (userData.role) {
      fields.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, email, full_name, role, created_at, updated_at
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM users WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  async findAll(
    pagination: PaginationQuery
  ): Promise<{ users: UserResponse[]; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) as total FROM users`;
    const countResult = await db.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT id, email, full_name, role, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limit, offset]);

    return {
      users: result.rows,
      total,
    };
  }
}
