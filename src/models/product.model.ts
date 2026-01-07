export interface Product {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  is_wine: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
