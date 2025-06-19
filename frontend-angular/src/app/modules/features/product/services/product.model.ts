export interface ProductCategory {
  id?: number;
  name: string;
}

export interface ProductSubCategory {
  id?: number;
  categoryId: number;
  name: string;
  modifiedDate?: string;
}

export interface Product {
  id?: number;
  subCategoryId: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  active: boolean;
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
}

export interface ProductFilters {
  subCategoryId?: number | null;
  page?: number | null;
  size?: number | null;
  sort?: string | null;
}
