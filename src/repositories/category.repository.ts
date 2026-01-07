import { BaseRepository } from "./base.repository";
import { Category } from "../models/category.model";

export class CategoryRepository extends BaseRepository<Category> {
  public async findAll(): Promise<Category[]> {
    const sql = "SELECT * FROM categories ORDER BY id ASC;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findById(id: number): Promise<Category | null> {
    const sql = "SELECT * FROM categories WHERE id = $1;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async create(data: Partial<Category>): Promise<Category> {
    const { name, description } = data;
    const sql = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const params = [name, description];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(
    id: number,
    data: Partial<Category>
  ): Promise<Category | null> {
    const { name, description } = data;
    const sql = `
      UPDATE categories
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *;
    `;
    const params = [name, description, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM categories WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
