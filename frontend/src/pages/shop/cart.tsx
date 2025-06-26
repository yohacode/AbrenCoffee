import React, { useState } from 'react';
import './cart.css';
import { useCart } from '../../pages/shop/useCart';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 3;

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeItem, totalPrice, updateItemQuantity } = useCart();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  if (!isOpen) return null;

  const totalPages = Math.ceil(cartItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = cartItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1));
  const handleNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  
  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {paginatedItems.map((item) => (
                <li key={item.product.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-image">
                      <img
                        src={`http://127.0.0.1:8000/${item.product.image}`}
                        alt={item.product.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg';
                        }}
                      />
                    </span>
                    <span className="cart-item-name">{item.product.name}</span>
                    <span className="cart-item-price">${item.price} </span>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      ➖
                    </button>
                    <span className="cart-item-name">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                    >
                      ➕
                    </button>
                    <button onClick={() => removeItem(item.product.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    className={pageNum === currentPage ? 'active' : ''}
                    onClick={() => handlePageClick(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          </>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="cart-total">
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </div>
            <div className="button-group">
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
              <button
                className="checkout-btn"
                onClick={() => {
                  onClose();
                  navigate('/shop/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
           
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
