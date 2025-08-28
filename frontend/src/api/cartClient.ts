import axios from 'axios';
import { api } from './config';
import { CartItem } from '../types/cart';

// API client with base configuration
const cartClient = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order creation payload based on existing API structure
export interface CreateOrderPayload {
  branchId: number;
  name: string;
  description: string;
  status: string;
  orderDetails: {
    productId: number;
    quantity: number;
    unitPrice: number;
    notes: string;
  }[];
}

// Coupon validation response
export interface CouponValidationResponse {
  valid: boolean;
  discountPercentage: number;
  message: string;
}

/**
 * Validates a coupon code.
 * For MVP, this uses client-side validation. In production, this would call the backend.
 * 
 * @param code - The coupon code to validate
 * @returns Promise with validation result
 */
export const validateCoupon = async (code: string): Promise<CouponValidationResponse> => {
  // Mock implementation for MVP
  // In production, this would make an API call: POST /api/coupons/validate
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (code.toUpperCase()) {
        case 'SAVE10':
          resolve({
            valid: true,
            discountPercentage: 10,
            message: '10% discount applied!',
          });
          break;
        case 'SAVE20':
          resolve({
            valid: true,
            discountPercentage: 20,
            message: '20% discount applied!',
          });
          break;
        default:
          resolve({
            valid: false,
            discountPercentage: 0,
            message: 'Invalid coupon code',
          });
      }
    }, 300); // Simulate network delay
  });
};

/**
 * Creates an order from cart items using the existing order API.
 * 
 * @param cartItems - Array of cart items to checkout
 * @param couponCode - Applied coupon code (if any)
 * @param userInfo - User information for the order
 * @returns Promise with created order
 */
export const checkout = async (
  cartItems: CartItem[],
  couponCode?: string,
  userInfo?: { branchId?: number; customerName?: string }
): Promise<any> => {
  try {
    // Generate a unique order ID (in production, this would be handled by the backend)
    const orderId = Date.now();
    const branchId = userInfo?.branchId || 1; // Default to branch 1
    
    // Create order payload
    const orderPayload: CreateOrderPayload = {
      branchId,
      name: `Cart Order ${orderId}`,
      description: `Order created from cart with ${cartItems.length} items${couponCode ? ` (Coupon: ${couponCode})` : ''}`,
      status: 'pending',
      orderDetails: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        notes: `Cart item: ${item.name} (SKU: ${item.sku})`,
      })),
    };

    // Add orderId to the payload (the API expects it)
    const orderWithId = {
      orderId,
      orderDate: new Date().toISOString(),
      ...orderPayload,
    };

    // Call the existing order creation API
    const response = await cartClient.post(api.endpoints.orders, orderWithId);
    
    return {
      success: true,
      order: response.data,
      orderId: orderId,
    };
  } catch (error) {
    console.error('Checkout failed:', error);
    throw new Error('Failed to process checkout. Please try again.');
  }
};

/**
 * Get order details by ID.
 * 
 * @param orderId - The order ID to retrieve
 * @returns Promise with order details
 */
export const getOrder = async (orderId: number) => {
  try {
    const response = await cartClient.get(`${api.endpoints.orders}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get order:', error);
    throw new Error('Failed to retrieve order details.');
  }
};

export default {
  validateCoupon,
  checkout,
  getOrder,
};