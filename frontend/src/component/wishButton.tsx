import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

interface Wish {
  id: number;
  user: string;
  product: Product;
  added_at: string;
}

interface WishButtonProps {
  show: boolean;
  productId: number;
  userId: number;
}

const WishButton: React.FC<WishButtonProps> = ({ show, productId, userId }) => {
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Wish[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('/wishlist/list/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setWishlist(response.data);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      }
    };

    fetchWishlist();
  }, []);

  useEffect(() => {
    // Check if current product is in the wishlist
    const wished = wishlist.some(w => w.product.id === productId);
    setIsWished(wished);
  }, [wishlist, productId]);

  const handleWishCreate = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      await axios.post(
        '/wishlist/create/',
        { product: productId, user: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsWished(true);
      toast.success('✅ Added to wishlist!');
    } catch {
      toast.error('❌ Failed to add to wishlist.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <button
      onClick={handleWishCreate}
      disabled={loading || isWished}
      className="wish-button"
    >
      {isWished ? '💖' : '🤍'}
    </button>
  );
};

export default WishButton;
