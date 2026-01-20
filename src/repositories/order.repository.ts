import { BaseRepository } from "./base.repository";
import { Order } from "../models/order.model";

export class OrderRepository extends BaseRepository<Order> {
  public async findAll(limit: number = 10, offset: number = 0): Promise<{ orders: Order[], total: number }> {
    const sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2;";
    const countSql = "SELECT COUNT(*) FROM orders;";
    
    const [result, countResult] = await Promise.all([
      this.db.query(sql, [limit, offset]),
      this.db.query(countSql)
    ]);

    return {
      orders: result.rows,
      total: Number(countResult.rows[0].count)
    };
  }

  public async findById(id: number): Promise<Order | null> {
    const sql = "SELECT * FROM orders WHERE id = $1 AND deleted_at IS NULL;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      throw new Error("No se encontro la orden");
    }
    return result.rows[0];
  }

  public async findByUserId(userId: number): Promise<{ orders: Order[], total: number }> {
    const sql = "SELECT * FROM orders WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC;";
    const countSql = "SELECT COUNT(*) FROM orders WHERE user_id = $1 AND deleted_at IS NULL;";

    const [result, countResult] = await Promise.all([
      this.db.query(sql, [userId]),
      this.db.query(countSql, [userId])
    ])

    return {
      total: Number(countResult.rows[0].count),
      orders: result.rows,
    };
  }

  public async create(data: Partial<Order>): Promise<Order> {
    const { user_id, total_amount } = data;
    const sql = `
      INSERT INTO orders (user_id, total_amount)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const params = [user_id, total_amount];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(id: number, data: Partial<Order>): Promise<Order | null> {
    const { total_amount } = data;
    const sql = `
      UPDATE orders
      SET total_amount = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const params = [total_amount, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
