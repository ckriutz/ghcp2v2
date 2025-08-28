import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartPage() {
  const { state, clearCart } = useCart();
  const { darkMode } = useTheme();

  const handleCheckout = async () => {
    // For now, just show an alert. This will be replaced with actual checkout logic.
    alert(`Checkout initiated for ${state.items.length} items totaling $${state.summary.total.toFixed(2)}`);
    
    // In a real implementation, this would call the checkout API
    // and redirect to a success page or show a confirmation
    // For now, we'll clear the cart to simulate a successful checkout
    clearCart();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-900'} mb-2`}>
            Shopping Cart
          </h1>
          <nav className="text-sm">
            <Link
              to="/"
              className={`${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-500 hover:text-primary'} transition-colors`}
            >
              Home
            </Link>
            <span className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
            <span className={`${darkMode ? 'text-light' : 'text-gray-900'}`}>Cart</span>
          </nav>
        </div>

        {state.items.length === 0 ? (
          /* Empty Cart State */
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
            <svg className="w-24 h-24 mx-auto mb-6 opacity-50 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6h2.5"
              />
            </svg>
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
              Your cart is empty
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    Cart Items ({state.items.length})
                  </h2>
                  {state.items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className={`text-sm px-3 py-1 rounded transition-colors ${
                        darkMode
                          ? 'text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-400'
                          : 'text-gray-500 hover:text-red-500 border border-gray-300 hover:border-red-300'
                      }`}
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
                <div>
                  {state.items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className={`inline-flex items-center gap-2 ${
                    darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'
                  } transition-colors`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md sticky top-24`}>
                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
                    Order Summary
                  </h2>
                </div>
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}