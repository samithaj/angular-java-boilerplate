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
}

export interface AddressFilters {
  page?: number | null;
  size?: number | null;
  sort?: string | null;
}
