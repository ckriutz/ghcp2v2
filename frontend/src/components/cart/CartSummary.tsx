import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const { state, applyCoupon } = useCart();
  const { darkMode } = useTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    
    // Simple coupon validation for MVP
    if (couponInput === 'SAVE10' || couponInput === 'SAVE20') {
      applyCoupon(couponInput);
      setCouponInput('');
    } else if (couponInput.trim()) {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      return;
    }
    
    if (onCheckout) {
      onCheckout();
    }
  };

  if (state.items.length === 0) {
    return (
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6h2.5"
          />
        </svg>
        <p className="text-lg mb-2">Your cart is empty</p>
        <p className="text-sm">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Coupon Input */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-light' : 'text-gray-700'}`}>
          Coupon Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className={`flex-1 px-3 py-2 text-sm border rounded-md transition-colors ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-light placeholder-gray-400 focus:border-primary focus:ring-primary'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary'
            } focus:outline-none focus:ring-1`}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponInput.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-accent disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p className="text-red-500 text-xs mt-1">{couponError}</p>
        )}
        {state.couponCode && (
          <p className="text-green-500 text-xs mt-1">Coupon "{state.couponCode}" applied!</p>
        )}
        <p className="text-xs mt-1 text-gray-500">Try: SAVE10 or SAVE20</p>
      </div>

      {/* Order Summary */}
      <div className="space-y-2 mb-4">
        <div className={`flex justify-between text-sm ${darkMode ? 'text-light' : 'text-gray-700'}`}>
          <span>Subtotal:</span>
          <span>${state.summary.subtotal.toFixed(2)}</span>
        </div>
        
        {state.summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount:</span>
            <span>-${state.summary.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={`flex justify-between text-sm ${darkMode ? 'text-light' : 'text-gray-700'}`}>
          <span>Shipping:</span>
          <span>{state.summary.shipping > 0 ? `$${state.summary.shipping.toFixed(2)}` : 'FREE'}</span>
        </div>
        
        <div className={`flex justify-between text-lg font-bold pt-2 border-t ${
          darkMode ? 'border-gray-700 text-light' : 'border-gray-200 text-gray-900'
        }`}>
          <span>Total:</span>
          <span>${state.summary.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-primary hover:bg-accent text-white font-medium py-3 px-4 rounded-md transition-colors"
      >
        Proceed to Checkout
      </button>
      
      {state.summary.subtotal <= 100 && (
        <p className="text-xs text-center mt-2 text-gray-500">
          Add ${(100 - state.summary.subtotal).toFixed(2)} more for free shipping!
        </p>
      )}
    </div>
  );
}