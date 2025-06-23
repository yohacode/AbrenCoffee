import React, { useState} from 'react';
import axios from '../../utils/axios';
import './subscriptionForm.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProductWithFrequency extends Product {
  frequency: string; // Adjust the type as needed
}

interface SubscribeFormProps {
  selectedProducts: ProductWithFrequency[];
}


interface Product {
  id: number;
  name: string;
  price: string;
  frequency: string;
  is_subscription: boolean;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ selectedProducts }) => {
  const [provider, setProvider] = useState<'stripe' | 'paypal'>('stripe');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (selectedProducts.length === 0) {
      alert('No subscription products selected.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post('/subscription/to/', {
        provider,
        price: selectedProducts[0].price, // Assuming 1 product for now
        frequency: selectedProducts[0].frequency, // Assuming frequency is part of the product
        product_id: selectedProducts[0].id  // Assuming 1 product for now
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        alert('No checkout URL returned.');
      }
    } catch {
      toast.error('Failed to subscribe. Login First!');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-checkout">
      <h2 className="checkout-title">Ready to Subscribe?</h2>

      <label htmlFor="provider-select" className="provider-label">
        Payment Provider
      </label>
      <select
        id="provider-select"
        className="provider-select"
        value={provider}
        onChange={(e) => setProvider(e.target.value as 'stripe' | 'paypal')}
      >
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
      </select>

      <button
        className="subscribe-button"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? 'Redirecting...' : `Subscribe with ${provider}`}
      </button>
    </div>
  );
};

export default SubscribeForm;
