export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: string;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

export interface ApiDataResponse<T> {
  data: T;
}
