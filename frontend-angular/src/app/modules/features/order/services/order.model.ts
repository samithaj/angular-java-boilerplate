export interface OrderLine {
  productId: number;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface Order {
  id?: number;
  orderDate: string;
  status: string;
  customerId: number;
  lines: OrderLine[];
  totalAmount?: number;
}

export interface OrderPage {
  content: Order[];
  totalElements: number;
}
