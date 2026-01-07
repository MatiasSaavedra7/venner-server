export interface Wine {
  product_id: number;
  varietal?: string;
  winery?: string;
  country?: string;
  province?: string;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
