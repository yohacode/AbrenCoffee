import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import ConfirmModal from '../../component/confirmDelete';
import { useCart } from '../shop/useCart'; // ✅ Make sure this hook is available

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface Wish {
  id: number;
  user: string;
  product: Product;
  added_at: string;
  quantity?: number;
}

const ITEMS_PER_PAGE = 5;

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wish[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('/wishlist/list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data);
      } catch {
        toast.error('❌ Failed to load wishlist.');
      }
    };

    fetchWishlist();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setShowConfirm(false);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`/wishlist/delete/${deletingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((wish) => wish.id !== deletingId));
      toast.success('✅ Item removed from wishlist!');
    } catch {
      toast.error('❌ Failed to delete item.');
    }
  };

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPrice = wishlist.reduce(
    (sum, item) => sum + item.product.price * (item.quantity ?? 1),
    0
  );

  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h2 className="wishlist-header">Your Wishlist</h2>

        {wishlist.length === 0 ? (
          <p>Your Wishlist is empty.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {paginatedItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <img
                      src={`http://127.0.0.1:8000/${item.product.image}`}
                      alt={item.product.name}
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg')
                      }
                      className="cart-item-image"
                    />
                    <span className="cart-item-name">{item.product.name}</span>
                    <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                  </div>

                  <div className="cart-item-controls">
                    <button onClick={() => addItem({ ...item.product, stock: 1, quantity: 1 })}>Add to Cart</button>
                    <button onClick={() => navigate(`/product/${item.product.id}`)}>View</button>
                    <button onClick={() => handleDeleteClick(item.id)}>🗑️</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPage === idx + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>

            {/* Total Price & Actions */}
            <div className="cart-total">
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </div>

            <div className="button-group">
              <button onClick={() => navigate('/shop')}>Continue Shopping</button>
              <button onClick={() => navigate('/checkout')}>Checkout</button>
            </div>
          </>
        )}

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={showConfirm}
          title="Remove from Wishlist"
          message="Are you sure you want to remove this item?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export default Wishlist;
