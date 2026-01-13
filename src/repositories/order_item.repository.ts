import { BaseRepository } from "./base.repository";
import { OrderItem } from "../models/order_item.model";

export class OrderItemRepository extends BaseRepository<OrderItem> {
  public async findAll(): Promise<OrderItem[]> {
    const sql = "SELECT * FROM order_items ORDER BY id ASC;";
    const result = await this.db.query(sql);
    return result.rows;
  }

  public async findById(id: number): Promise<OrderItem | null> {
    const sql = "SELECT * FROM order_items WHERE id = $1 AND deleted_at IS NULL;";
    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      throw new Error("No se encontro el item de la orden");
    }
    return result.rows[0];
  }

  public async findByOrderId(orderId: number): Promise<OrderItem[]> {
    const sql = `
      SELECT oi.*, p.name as product_name, 
      (SELECT url FROM images_product ip WHERE ip.product_id = p.id LIMIT 1) as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1 AND oi.deleted_at IS NULL;
    `;
    
    const result = await this.db.query(sql, [orderId]);
    return result.rows;
  }

  public async create(data: Partial<OrderItem>): Promise<OrderItem> {
    const { order_id, product_id, quantity, price_at_order } = data;
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const params = [order_id, product_id, quantity, price_at_order];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  public async update(id: number, data: Partial<OrderItem>): Promise<OrderItem | null> {
    const { quantity, price_at_order } = data;

    if (!quantity || !price_at_order) {
      throw new Error("Se requieren quantity y price_at_order para actualizar un item de orden");
    }

    const sql = `
      UPDATE order_items
      SET quantity = $1, price_at_order = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    
    const params = [quantity, price_at_order, id];
    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  public async delete(id: number): Promise<boolean> {
    const sql = "UPDATE order_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1;";
    try {
      const result = await this.db.query(sql, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw error;
    }
  }
}
