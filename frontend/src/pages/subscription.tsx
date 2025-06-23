import React, { useEffect, useState, useCallback } from 'react';
import './Subscription.css';
import { Link } from 'react-router-dom';
import {
  FaCcAmazonPay,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
} from 'react-icons/fa';
import { FaCcVisa } from 'react-icons/fa6';
import { useCart } from './shop/useCart';
import axios from '../utils/axios';
import SubscribeForm from './subscription/SubscribeForm';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  is_subscription: boolean;
}

export interface ProductWithFrequency extends Product {
  delivery_frequency: string;
}

const guides = [
  { number: 1, title: 'Choose Your Favorite Coffee' },
  { number: 2, title: 'Determine order interval' },
  { number: 3, title: 'Add to cart and All done' },
];

const plans = [
  {
    title: 'Weekly Plan',
    description: 'Fresh coffee delivered every week.',
    price: '$15/week',
  },
  {
    title: 'Monthly Plan',
    description: 'A curated selection of beans monthly.',
    price: '$45/month',
  },
  {
    title: 'Office Plan',
    description: 'Bulk deliveries for your workspace.',
    price: 'Custom Quote',
  },
];

const PAYMENT_LINKS = [
  { href: 'https://www.facebook.com/abren', icon: <FaCcMastercard /> },
  { href: 'https://www.instagram.com/abren', icon: <FaCcVisa /> },
  { href: 'https://www.tiktok.com/@abren', icon: <FaCcAmazonPay /> },
  { href: 'https://www.twitch.tv/abren', icon: <FaCcPaypal /> },
  { href: 'https://x.com/abren', icon: <FaCcStripe /> },
];

const PaymentLinks = () => (
  <div className="subscripton-payment">
    {PAYMENT_LINKS.map(({ href, icon }, i) => (
      <Link key={i} to={href} className="social" target="_blank" rel="noopener noreferrer">
        {icon}
      </Link>
    ))}
  </div>
);

const PlanCard = ({ title, description, price }: { title: string; description: string; price: string }) => (
  <div className="plan-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <span className="price">{price}</span>
  </div>
);

const GuideCard = ({ number, title }: { number: number; title: string }) => (
  <div className="guid-card">
    <span>{number}</span>
    <p>{title}</p>
  </div>
);

const ProductCard = ({
  product,
  frequency,
  onFrequencyChange,
  onAddToCart,
  onRemove,
  onUpdateQuantity,
  isLoading,
}: {
  product: ProductWithFrequency;
  frequency: string;
  onFrequencyChange: (id: number, freq: string) => void;
  onAddToCart: (product: ProductWithFrequency) => void;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
  isLoading: boolean;
  cartItemCount: number;
}) => {
  const isOutOfStock = product.stock === 0;
  const quantity = product.quantity ?? 1;

  return (
    <article className="item-card" key={product.id}>
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>

      <button
        className="addCart"
        onClick={() => onAddToCart({ ...product, delivery_frequency: frequency })}
        disabled={isLoading || isOutOfStock}
      >
        {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <div className="cart-item-controls">
        <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} disabled={quantity <= 1}>➖</button>
        <button onClick={() => onUpdateQuantity(product.id, quantity + 1)}>➕</button>
        <button onClick={() => onRemove(product.id)}>🗑️</button>

        <select
          value={frequency}
          onChange={(e) => onFrequencyChange(product.id, e.target.value)}
          className="frequency-select"
          aria-label="Delivery frequency"
        >
          <option value="none">One-time</option>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </article>
  );
};

const Subscription: React.FC = () => {
  const [selectedFrequencies, setSelectedFrequencies] = useState<{ [id: number]: string }>({});
  const [products, setProducts] = useState<ProductWithFrequency[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const { removeItem, updateItemQuantity, cartItemCount, addItem } = useCart();

  useEffect(() => {
    axios.get<ProductWithFrequency[]>('/products/list/')
      .then((res) => {
        const subscriptionProducts = res.data
          .filter(p => p.is_subscription)
          .map((p) => ({
            ...p,
            price: Number(p.price),
            quantity: Number(p.quantity),
            delivery_frequency: 'none',
          }));
        setProducts(subscriptionProducts);
      })
      .catch(() => setError('Failed to load subscription products.'));
  }, []);

  const handleFrequencyChange = useCallback((id: number, freq: string) => {
    setSelectedFrequencies(prev => ({ ...prev, [id]: freq }));
  }, []);

  const handleAddToCart = useCallback((product: ProductWithFrequency) => {
    setLoadingIds(prev => new Set(prev).add(product.id));
    addItem(product);
    setTimeout(() => {
      setLoadingIds(prev => {
        const copy = new Set(prev);
        copy.delete(product.id);
        return copy;
      });
    }, 500);
  }, [addItem]);

  const subscriptionEligibleProducts = products.filter(
    p => selectedFrequencies[p.id] && selectedFrequencies[p.id] !== 'none'
  );

  return (
    <div className="subscription">
      <div className="subscription-container">
        <section className="subscription-hero">
          <h1 className="subscription-title">Subscribe to Fresh Coffee</h1>
          <p className="subscription-intro">Enjoy premium coffee weekly or monthly.</p>
          <p>Enjoy 10% off for subscribers!</p>
          <PaymentLinks />
        </section>

        <section className="subscription-plans">
          {plans.map(plan => (
            <PlanCard key={plan.title} {...plan} />
          ))}
        </section>

        <section className="subscription-guide">
          {guides.map(guide => (
            <GuideCard key={guide.number} {...guide} />
          ))}
        </section>

        <section className="subscription-items">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              frequency={selectedFrequencies[product.id] || 'none'}
              onFrequencyChange={handleFrequencyChange}
              onAddToCart={handleAddToCart}
              onRemove={removeItem}
              onUpdateQuantity={updateItemQuantity}
              isLoading={loadingIds.has(product.id)}
              cartItemCount={cartItemCount}
            />
          ))}
        </section>

        {subscriptionEligibleProducts.length > 0 && (
          <SubscribeForm
            selectedProducts={subscriptionEligibleProducts.map(p => ({
              ...p,
              price: p.price.toString(),
              frequency: selectedFrequencies[p.id],
              is_subscription: true,
            }))}
          />
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Subscription;
