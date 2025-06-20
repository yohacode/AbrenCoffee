import React, { useState } from 'react';
import axios from '../utils/axios'; // Make sure this path is correct
import { toast } from 'react-toastify';

interface WishButtonProps {
  show: boolean;              // Controls visibility of button
  productId: number | string;
  userId: number | string;
}

const WishButton: React.FC<WishButtonProps> = ({ show, productId, userId }) => {
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

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

  return (
    <button onClick={handleWishCreate} disabled={loading || isWished}>
      {isWished ? '💖' : '🤍'}
    </button>
  );
};

export default WishButton;
