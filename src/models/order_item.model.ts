export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
