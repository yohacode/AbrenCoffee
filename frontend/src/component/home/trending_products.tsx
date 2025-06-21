import React, { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axios';
import { useCart } from '../../pages/shop/useCart'; // ✅ Import global cart context
import { useNavigate } from 'react-router-dom';
import './trending_products.css';
import { toast } from 'react-toastify';
import WishButton from '../wishButton';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
    quantity: number;
  }

const Trending_products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart(); // ✅ Use global cart context
  const navigate = useNavigate();
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const maxItems = 3;

  const handleScrollChange = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current) {
      setScrolledUp(true); // User is scrolling up
    } else {
      setScrolledUp(false); // User is scrolling down
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsResponse = await axios.get<Product[]>('/products/list/');
        setProducts(productsResponse.data.slice(0, maxItems));
      } catch {
        toast.error('Failed to load products. Please try again later.');
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className="trending-products">
        <h1>Trending Products</h1>
        
        {products.length > 0 ? (
            <div className='product_container'>
                {products.map((product, index) => (
                    <div className={scrolledUp ? "product_card anime": 'product_card'} key={index}>
                        <img src={product.image} alt="" />
                        <div className="description">
                            <p>{product.name}</p>
                            <p>${product.price}</p>
                        </div>
                        <div className="button-group">
                            <button
                                className="addCart"
                                onClick={() => addItem(product)}
                                type="button"
                                >
                                Add to Cart
                            </button>
                            <button
                                className="viewCart"
                                onClick={() => navigate(`/product/${product.id}`)}
                                type="button"
                                >
                                View Product
                            </button>
                        </div>
                        <WishButton show={true} productId={product.id} userId={1} />
                    </div>
                ))}
            </div>
        ) : (
            <>
                <p className='loading-products'>Loading products....</p>
            </>
        )}
    </div>
  )
}

export default Trending_products
