import { useContext } from 'react';
import { CartContext } from '../../context/cartContex'; 

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const {
    cartItemCount,
    cartItems = [],
    totalPrice,
    addItem,
    removeItem,
    clearCart,
    updateItemQuantity
  } = context;

  return {
    cartItems,
    cartItemCount,
    totalPrice,
    addItem,
    removeItem,
    clearCart,
    updateItemQuantity
  };
};
