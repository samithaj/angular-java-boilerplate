export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  addressId?: number | null;
}

export interface CustomerPage {
  content: Customer[];
  totalElements: number;
}

export interface CustomerFilters {
  page?: number | null;
  size?: number | null;
  sort?: string | null;
}
