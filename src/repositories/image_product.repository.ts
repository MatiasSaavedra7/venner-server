import { BaseRepository } from "./base.repository";
import { ImageProduct } from "../models/image_product.model";

export class ImageProductRepository extends BaseRepository<ImageProduct> {
  public async findAll(): Promise<ImageProduct[]> {
    const sql = "SELECT * FROM images_product ORDER BY id ASC;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findById(id: number): Promise<ImageProduct | null> {
    const sql = "SELECT * FROM images_product WHERE id = $1;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async create(data: Partial<ImageProduct>): Promise<ImageProduct> {
    const { product_id, url, alt_text } = data;
    const sql = `
      INSERT INTO images_product (product_id, url, alt_text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const params = [product_id, url, alt_text];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(
    id: number,
    data: Partial<ImageProduct>
  ): Promise<ImageProduct | null> {
    const { product_id, url, alt_text } = data;
    const sql = `
      UPDATE images_product
      SET product_id = $1, url = $2, alt_text = $3
      WHERE id = $4
      RETURNING *;
    `;
    const params = [product_id, url, alt_text, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM images_product WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
