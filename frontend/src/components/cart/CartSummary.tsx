import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function CartSummary() {
  const { getTotalPrice } = useCart();
  const { darkMode } = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const discountAmount = subtotal * appliedDiscount;
  const shipping = 10; // Fixed shipping cost
  const grandTotal = subtotal - discountAmount + shipping;

  const handleApplyCoupon = () => {
    // Simple coupon logic - in real app this would be validated against backend
    if (couponCode.toLowerCase() === 'save5') {
      setAppliedDiscount(0.05); // 5% discount
    } else {
      setAppliedDiscount(0);
    }
  };

  const handleUpdateCart = () => {
    // This could trigger a re-calculation or validation
    window.location.reload();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg transition-colors`}>
      <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 transition-colors`}>
        Order Summary
      </h2>
      
      <div className="space-y-4">
        <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {appliedDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount(5%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={`flex justify-between ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        
        <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} transition-colors`} />
        
        <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <button 
          className="w-full bg-primary hover:bg-accent text-white py-3 px-6 rounded-lg font-medium transition-colors"
          onClick={() => alert('Checkout functionality would be implemented here')}
        >
          Proceed To Checkout
        </button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors min-w-0`}
          />
          <button 
            onClick={handleApplyCoupon}
            className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap sm:flex-shrink-0"
          >
            Apply Coupon
          </button>
        </div>
        
        <button 
          onClick={handleUpdateCart}
          className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} py-2 px-6 rounded-lg font-medium transition-colors`}
        >
          Update Cart
        </button>
      </div>
    </div>
  );
}