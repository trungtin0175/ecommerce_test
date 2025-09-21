export interface ICartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface ICart {
  id: number;
  products: ICartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface UpdateCartPayload {
  cartId: number;
  products: { id: number; quantity: number }[];
}

export interface AddToCartPayload {
  userId: number;
  products: { id: number; quantity: number }[];
}
