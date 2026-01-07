import pool from "../database/config/db";
import { User } from "../models/users.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
  public async findAll(): Promise<User[]> {
    const sql = "SELECT * FROM users ORDER BY id ASC;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findById(id: number): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE id = $1;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  }

  public async create(data: Partial<User>): Promise<User> {
    const { name, last_name, email, password } = data;
    const sql = `
      INSERT INTO users (name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const params = [name, last_name, email, password];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(id: number, data: Partial<User>): Promise<User | null> {
    const { name, last_name, email, password, is_admin } = data;
    const sql = `
      UPDATE users
      SET name = $1, last_name = $2, email = $3, password = $4, is_admin = $5
      WHERE id = $6
      RETURNING *;
    `;
    const params = [name, last_name, email, password, is_admin, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM users WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
