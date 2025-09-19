import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

interface CartItemProps {
  item: {
    product: {
      productId: number;
      name: string;
      imgName: string;
      price: number;
      discount?: number;
    };
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const getPrice = () => {
    return item.product.discount 
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
  };

  const getTotal = () => {
    return getPrice() * item.quantity;
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.productId);
    } else {
      updateQuantity(item.product.productId, newQuantity);
    }
  };

  return (
    <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b transition-colors`}>
      <td className="p-4 text-center">
        {item.product.productId}
      </td>
      <td className="p-4">
        <div className="flex items-center">
          <img 
            src={`/${item.product.imgName}`} 
            alt={item.product.name}
            className="w-16 h-16 object-contain mr-4"
          />
        </div>
      </td>
      <td className={`p-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium transition-colors`}>
        {item.product.name}
      </td>
      <td className={`p-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
        ${getPrice().toFixed(2)}
      </td>
      <td className="p-4">
        <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 w-fit transition-colors`}>
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
          >
            -
          </button>
          <span className={`min-w-[2rem] text-center ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors`}>
            {item.quantity}
          </span>
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} transition-colors`}
          >
            +
          </button>
        </div>
      </td>
      <td className={`p-4 ${darkMode ? 'text-light' : 'text-gray-800'} font-medium transition-colors`}>
        ${getTotal().toFixed(2)}
      </td>
      <td className="p-4">
        <button 
          onClick={() => removeFromCart(item.product.productId)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}