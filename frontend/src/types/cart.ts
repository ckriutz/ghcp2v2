export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  sku: string;
  unit: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string;
  summary: CartSummary;
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: any; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: { isOpen: boolean } }
  | { type: 'LOAD_CART'; payload: CartState };

export interface CartContextType {
  state: CartState;
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
}