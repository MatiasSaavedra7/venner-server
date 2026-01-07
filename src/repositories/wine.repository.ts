import { BaseRepository } from "./base.repository";
import { Wine } from "../models/wine.model";

export class WineRepository extends BaseRepository<Wine> {
  public async findAll(): Promise<Wine[]> {
    const sql = "SELECT * FROM wines;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  // Find by product_id since it acts as the primary key reference
  public async findById(product_id: number): Promise<Wine | null> {
    const sql = "SELECT * FROM wines WHERE product_id = $1;";
    const result = await this.db.query(sql, [product_id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async create(data: Partial<Wine>): Promise<Wine> {
    const { product_id, varietal, winery, country, province, location } = data;
    const sql = `
      INSERT INTO wines (product_id, varietal, winery, country, province, location)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [product_id, varietal, winery, country, province, location];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(
    product_id: number,
    data: Partial<Wine>
  ): Promise<Wine | null> {
    const { varietal, winery, country, province, location } = data;
    const sql = `
      UPDATE wines
      SET varietal = $1, winery = $2, country = $3, province = $4, location = $5
      WHERE product_id = $6
      RETURNING *;
    `;
    const params = [varietal, winery, country, province, location, product_id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(product_id: number): Promise<boolean> {
    const sql = "DELETE FROM wines WHERE product_id = $1;";
    try {
      const result = await this.db.query(sql, [product_id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
