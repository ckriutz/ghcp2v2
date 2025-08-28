import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function CartButton() {
  const { toggleCart, getTotalItems } = useCart();
  const { darkMode } = useTheme();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className={`relative p-2 rounded-full transition-colors ${
        darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Shopping cart icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6h2.5M10 21a1 1 0 102 0 1 1 0 00-2 0m7 0a1 1 0 102 0 1 1 0 00-2 0"
        />
      </svg>
      
      {/* Quantity badge */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full min-w-[1.25rem] h-5">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}