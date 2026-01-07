import { BaseRepository } from "./base.repository";
import { Product } from "../models/product.model";

export class ProductRepository extends BaseRepository<Product> {
  public async findAll(): Promise<Product[]> {
    const sql = "SELECT * FROM products ORDER BY id ASC;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findWinesOrCategoryOne(): Promise<any[]> {
    const sql = `
      SELECT p.*, w.varietal, w.winery, w.country, w.province, w.location
      FROM products p
      LEFT JOIN wines w ON p.id = w.product_id
      WHERE p.is_wine = true OR p.category_id = 1;
    `;
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findById(id: number): Promise<Product | null> {
    const sql = "SELECT * FROM products WHERE id = $1;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async create(data: Partial<Product>): Promise<Product> {
    const { category_id, name, description, price, stock, is_wine } = data;
    const sql = `
      INSERT INTO products (category_id, name, description, price, stock, is_wine)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [category_id, name, description, price, stock, is_wine];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(
    id: number,
    data: Partial<Product>
  ): Promise<Product | null> {
    const { category_id, name, description, price, stock, is_wine } = data;
    const sql = `
      UPDATE products
      SET category_id = $1, name = $2, description = $3, price = $4, stock = $5, is_wine = $6
      WHERE id = $7
      RETURNING *;
    `;
    const params = [category_id, name, description, price, stock, is_wine, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "DELETE FROM products WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }

  public async findAllWithPagination(options: {
    limit: number;
    offset: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const { limit, offset, search, category, minPrice, maxPrice, sort } = options;

    const whereClauses: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Filtro de busqueda
    if (search) {
      whereClauses.push(
        `(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      );
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filtro de categoria
    if (category) {
      whereClauses.push(`c.name ILIKE $${paramIndex}`);
      queryParams.push(`%${category}%`);
      paramIndex++;
    }

    // Filtro de precio
    if (minPrice !== undefined) {
      whereClauses.push(`p.price >= $${paramIndex}`);
      queryParams.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== undefined) {
      whereClauses.push(`p.price <= $${paramIndex}`);
      queryParams.push(maxPrice);
      paramIndex++;
    }

    const whereString =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Ordenamiento
    let orderByString = "ORDER BY p.id ASC";
    if (sort) {
      const [field, order] = sort.split(":");
      const validFields = ["id", "price", "created_at", "name"];
      const validOrders = ["asc", "desc"];
      if (
        validFields.includes(field) &&
        validOrders.includes(order?.toLowerCase())
      ) {
        orderByString = `ORDER BY p.${field} ${order.toUpperCase()}`;
      }
    }

    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ${whereString} 
      ${orderByString} 
      LIMIT $${paramIndex} 
      OFFSET $${paramIndex + 1}
    `;

    const countSql = `
      SELECT COUNT(*) 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereString}
    `;

    const [productsResult, countResult] = await Promise.all([
      this.db.query(sql, [...queryParams, limit, offset]),
      this.db.query(countSql, queryParams),
    ]);

    return {
      products: productsResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }
}
