export interface Address {
  id?: number;
  street: string;
  city: string;
  state?: string | null;
  postalCode: string;
}

export interface AddressPage {
  content: Address[];
  totalElements: number;
  totalPages: number;
  number: number;    // Current page number (0-based)
  size: number;      // Page size
  first: boolean;    // Is first page
  last: boolean;     // Is last page
  numberOfElements: number;
  empty: boolean;
}

export interface AddressFilters {
  page?: number | null;
  size?: number | null;
  sort?: string | null;
}
