import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={`/images/${item.imgName}`}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h4 className={`font-medium text-sm ${darkMode ? 'text-light' : 'text-gray-900'} truncate`}>
          {item.name}
        </h4>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          SKU: {item.sku}
        </p>
        <p className={`text-sm font-medium ${darkMode ? 'text-primary' : 'text-primary'}`}>
          ${item.price.toFixed(2)} / {item.unit}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            darkMode
              ? 'border-gray-600 text-light hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          } transition-colors`}
          aria-label="Decrease quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <span className={`min-w-[2rem] text-center font-medium ${darkMode ? 'text-light' : 'text-gray-900'}`}>
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            darkMode
              ? 'border-gray-600 text-light hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          } transition-colors`}
          aria-label="Increase quantity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.productId)}
        className={`p-1 rounded-full transition-colors ${
          darkMode
            ? 'text-gray-400 hover:text-red-400'
            : 'text-gray-500 hover:text-red-500'
        }`}
        aria-label="Remove item from cart"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}