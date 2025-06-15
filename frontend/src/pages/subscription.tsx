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

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number; // delivery frequency count
}

interface ProductWithFrequency extends Product {
  delivery_frequency: string;
}

const PAYMENT_LINKS = [
  {
    href: 'https://www.facebook.com/abren',
    icon: <FaCcMastercard aria-label="Facebook" />,
  },
  {
    href: 'https://www.instagram.com/abren',
    icon: <FaCcVisa aria-label="Instagram" />,
  },
  {
    href: 'https://www.tiktok.com/@abren',
    icon: <FaCcAmazonPay aria-label="TikTok" />,
  },
  {
    href: 'https://www.twitch.tv/abren',
    icon: <FaCcPaypal aria-label="Twitch" />,
  },
  {
    href: 'https://x.com/abren',
    icon: <FaCcStripe aria-label="X (formerly Twitter)" />,
  },
];

const guides = [
  { number: 1, title: 'Choose Your Favorite Coffee' },
  { number: 2, title: 'Determine order interval' },
  { number: 3, title: 'Add to cart and All done' },
];

const plans = [
  {
    title: 'Weekly Plan',
    description:
      'Fresh coffee delivered every week. Perfect for busy professionals and daily brewers.',
    price: '$15/week',
  },
  {
    title: 'Monthly Plan',
    description:
      'A curated selection of beans delivered once a month. Ideal for occasional coffee lovers.',
    price: '$45/month',
  },
  {
    title: 'Office Plan',
    description:
      'Keep the team fueled with bulk deliveries for your workspace or business.',
    price: 'Custom Quote',
  },
];

const PaymentLinks: React.FC = () => (
  <div className="subscripton-payment">
    {PAYMENT_LINKS.map(({ href, icon }, i) => (
      <Link
        key={i}
        to={href}
        className="social"
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon}
      </Link>
    ))}
  </div>
);

const PlanCard: React.FC<{ title: string; description: string; price: string }> = ({
  title,
  description,
  price,
}) => (
  <div className="plan-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <span className="price">{price}</span>
  </div>
);

const GuideCard: React.FC<{ number: number; title: string }> = ({ number, title }) => (
  <div className="guid-card">
    <span>{number}</span>
    <p>{title}</p>
  </div>
);

interface ProductCardProps {
  product: ProductWithFrequency;
  frequency: string;
  onFrequencyChange: (productId: number, frequency: string) => void;
  onAddToCart: (product: ProductWithFrequency) => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  isLoading: boolean;
  cartItemCount: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  frequency,
  onFrequencyChange,
  onAddToCart,
  onRemove,
  onUpdateQuantity,
  isLoading,
}) => {
  const isOutOfStock = product.stock === 0;
  const quantity = product.quantity ?? 1;

  return (
    <article className="item-card" key={product.id}>
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <div className="product-details">
        <p className="price">${product.price.toFixed(2)}</p>
      </div>

      <button
        className="addCart"
        onClick={() => onAddToCart({ ...product, delivery_frequency: frequency })}
        disabled={isLoading || isOutOfStock}
        type="button"
      >
        {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <div className="cart-item-controls">
        <button
          aria-label="Decrease quantity"
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
          type="button"
        >
          ➖
        </button>


        <button
          aria-label="Increase quantity"
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          type="button"
        >
          ➕
        </button>

        <button aria-label="Remove item" onClick={() => onRemove(product.id)} type="button">
          🗑️
        </button>

        <select
          aria-label="Select delivery frequency"
          value={frequency}
          onChange={(e) => onFrequencyChange(product.id, e.target.value)}
          className="frequency-select"
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
  const [selectedFrequencies, setSelectedFrequencies] = useState<{ [productId: number]: string }>({});
  const [products, setProducts] = useState<ProductWithFrequency[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProductIds, setLoadingProductIds] = useState<Set<number>>(new Set());

  const { removeItem, updateItemQuantity, cartItemCount, addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get<ProductWithFrequency[]>('/products/list/');
        setProducts(
          res.data.map((p) => ({
            ...p,
            price: Number(p.price),
            quantity: Number(p.quantity),
            delivery_frequency: 'none',
          }))
        );
      } catch {
        setError('Failed to load products. Please try again later.');
      }
    }
    fetchProducts();
  }, []);

  const handleFrequencyChange = useCallback(
    (productId: number, frequency: string) => {
      setSelectedFrequencies((prev) => ({
        ...prev,
        [productId]: frequency,
      }));
    },
    []
  );

  const handleAddToCart = useCallback(
    (product: ProductWithFrequency) => {
      setLoadingProductIds((prev) => new Set(prev).add(product.id));
      addItem(product);
      setTimeout(() => {
        setLoadingProductIds((prev) => {
          const copy = new Set(prev);
          copy.delete(product.id);
          return copy;
        });
      }, 500); // simulate loading delay
    },
    [addItem]
  );

  return (
    <div className="subscription">
      <div className="subscription-container">
        <section className="subscription-hero">
          <h1 className="subscription-title">Subscribe to Fresh Coffee</h1>
          <p className="subscription-intro">
            Enjoy our premium coffee delivered straight to your door every week or month. Choose a plan that suits your taste and schedule.
          </p>
          <p>Enjoy 10% discount on Subscription</p>
          <PaymentLinks />
        </section>

        <section className="subscription-plans">
          {plans.map(({ title, description, price }) => (
            <PlanCard key={title} title={title} description={description} price={price} />
          ))}
        </section>

        <section className="subscription-guide">
          {guides.map(({ number, title }) => (
            <GuideCard key={number} number={number} title={title} />
          ))}
        </section>

        <section className="subscription-items">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              frequency={selectedFrequencies[product.id] || 'none'}
              onFrequencyChange={handleFrequencyChange}
              onAddToCart={handleAddToCart}
              onRemove={removeItem}
              onUpdateQuantity={updateItemQuantity}
              isLoading={loadingProductIds.has(product.id)}
              cartItemCount={cartItemCount}
            />
          ))}
        </section>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Subscription;
