// SubscriptionOptions.tsx
import axios from 'axios';
import { useState } from 'react';

interface SubscriptionOptionsProps {
  productId: string;
}

const SubscriptionOptions = ({ productId }: SubscriptionOptionsProps) => {
  const [provider, setProvider] = useState('stripe');

  const handleSubscribe = async () => {
    const res = await axios.post('/api/subscribe/', {
      product_id: productId,
      provider,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    window.location.href = res.data.checkout_url;
  };

  return (
    <div>
      <label htmlFor="provider-select">Choose payment provider:</label>
      <select
        id="provider-select"
        onChange={e => setProvider(e.target.value)}
        value={provider}
      >
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
        <option value="klarna">Klarna</option>
        <option value="swish">Swish</option>
      </select>
      <button onClick={handleSubscribe}>Subscribe with {provider}</button>
    </div>
  );
};
export default SubscriptionOptions;