import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { state, setCartOpen, clearCart } = useCart();
  const { darkMode } = useTheme();

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, setCartOpen]);

  const handleCheckout = async () => {
    // For now, just show an alert. This will be replaced with actual checkout logic.
    alert(`Checkout initiated for ${state.items.length} items totaling $${state.summary.total.toFixed(2)}`);
    
    // In a real implementation, this would call the checkout API
    // and redirect to a success page or show a confirmation
    // For now, we'll clear the cart to simulate a successful checkout
    clearCart();
    setCartOpen(false);
  };

  if (!state.isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setCartOpen(false)}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 max-w-[100vw] z-50 transform transition-transform ${
          darkMode ? 'bg-dark' : 'bg-white'
        } shadow-xl`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
            Shopping Cart
          </h2>
          <div className="flex items-center gap-2">
            {state.items.length > 0 && (
              <button
                onClick={clearCart}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-red-400'
                    : 'text-gray-500 hover:text-red-500'
                }`}
                title="Clear cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? 'text-gray-400 hover:text-light hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <CartSummary onCheckout={handleCheckout} />
            ) : (
              <>
                <div className="max-h-[60vh] overflow-y-auto">
                  {state.items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
                <CartSummary onCheckout={handleCheckout} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}