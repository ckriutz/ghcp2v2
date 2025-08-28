/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartState, CartAction, CartContextType, CartItem, CartSummary } from '../types/cart';

const CART_STORAGE_KEY = 'octocat-cart';

// Initial cart state
const initialCartState: CartState = {
  items: [],
  couponCode: '',
  summary: {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  },
  isOpen: false,
};

// Calculate cart summary
const calculateSummary = (items: CartItem[], couponCode: string): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Apply coupon discount (simple percentage discount for MVP)
  let discount = 0;
  if (couponCode === 'SAVE10') {
    discount = subtotal * 0.1;
  } else if (couponCode === 'SAVE20') {
    discount = subtotal * 0.2;
  }
  
  // Simple shipping calculation (free shipping over $100)
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;
  
  return {
    subtotal,
    discount,
    shipping,
    total,
  };
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === product.productId);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity,
          imgName: product.imgName,
          sku: product.sku,
          unit: product.unit,
        };
        newItems = [...state.items, newItem];
      }
      
      const summary = calculateSummary(newItems, state.couponCode);
      return { ...state, items: newItems, summary };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload.productId);
      const summary = calculateSummary(newItems, state.couponCode);
      return { ...state, items: newItems, summary };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.productId !== productId);
        const summary = calculateSummary(newItems, state.couponCode);
        return { ...state, items: newItems, summary };
      }
      
      const newItems = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const summary = calculateSummary(newItems, state.couponCode);
      return { ...state, items: newItems, summary };
    }
    
    case 'APPLY_COUPON': {
      const { code } = action.payload;
      const summary = calculateSummary(state.items, code);
      return { ...state, couponCode: code, summary };
    }
    
    case 'CLEAR_CART':
      return { ...initialCartState, isOpen: state.isOpen };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload.isOpen };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | null>(null);

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Recalculate summary to ensure consistency
        const summary = calculateSummary(parsedCart.items || [], parsedCart.couponCode || '');
        dispatch({
          type: 'LOAD_CART',
          payload: {
            ...parsedCart,
            summary,
            isOpen: false, // Always start with cart closed
          },
        });
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsedCart = JSON.parse(e.newValue);
          const summary = calculateSummary(parsedCart.items || [], parsedCart.couponCode || '');
          dispatch({
            type: 'LOAD_CART',
            payload: {
              ...parsedCart,
              summary,
              isOpen: state.isOpen, // Preserve current tab's drawer state
            },
          });
        } catch (error) {
          console.error('Failed to parse cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.isOpen]);

  // Action creators
  const addItem = (product: any, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const applyCoupon = (code: string) => {
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount: 0 } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: { isOpen } });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    clearCart,
    toggleCart,
    setCartOpen,
    getTotalItems,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}