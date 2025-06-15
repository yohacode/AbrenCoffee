import React from 'react';
import './Review.css';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}

interface Cart {
  cart_items: CartItem[];
  total_price: number;
}

interface Props {
    cart: Cart;
    phoneNumber: string;
    shippingAddressId: number; // Add this line
    onBack: () => void;
    onConfirm: () => void;
    loading: boolean;
  }

const Review: React.FC<Props> = ({ cart,  onBack, onConfirm, loading}) => {

  return (
    <div className="review-container">
      <h2 className="review-title">Review Your Order</h2>

      <div className='section'>
        <h3 className='title'>Items in Cart</h3>
        {cart.cart_items.map(({ product, quantity, total_price }) => (
          <div key={product.id} className='itemRow'>
            <span>
              {product.name} × {quantity}
            </span>
            <span>${total_price.toFixed(2)}</span>
          </div>
        ))}
        <p className='total'>Total: ${cart.total_price.toFixed(2)}</p>
      </div>

      <div className='section'>
        <button onClick={onBack} className='backBtn'>
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className='confirmBtn'
        >
          {loading ? 'Processing...' : 'Confirm and Pay'}
        </button>
      </div>
    </div>
  );
};

export default Review;
