import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart'; // ✅ Import global cart context
import './shop.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProductIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const { addItem } = useCart(); // ✅ Use global cart context

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsResponse = await axios.get<Product[]>('/products/list/');
        setProducts(
          productsResponse.data.map((p) => ({
            ...p,
            price: Number(p.price),
            quantity: Number(p.quantity),
          }))
        );
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchInitialData();
   
  }, []);


  return (
    <div className="shop">
      <div className="container">
        {error && <div className="error-banner">{error}</div>}
        <div className="shop-hero">
          <h1 className="shop-title">All Products</h1>
          <p className="shop-subtitle">
            We'd love to hear from you! Whether you have a question about features, pricing, or anything else,
            our team is ready to help.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => {
            const isLoading = loadingProductIds.has(product.id);
            const isOutOfStock = product.stock === 0;

            return (
              <article className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <div className="product-details">
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
                <button
                  className="addCart"
                  onClick={() => addItem(product)}
                  disabled={isLoading || isOutOfStock}
                  type="button"
                >
                  {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  className="viewCart"
                  onClick={() => navigate(`/product/${product.id}`)}
                  type="button"
                >
                  View Product
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;

