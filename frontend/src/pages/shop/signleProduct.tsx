import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import './single_product.css';
import { useCart } from './useCart';
import ProductImagePlacehoder from '../../../public/assets/images/images/create an image with another coffee packaging materials.png';
import Backbutton from '../../component/backbutton';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  cart_items: CartItem[];
}

const SingleProduct: React.FC = () => {
  // Initialize cart state
  const [cart, setCart] = useState<Cart | null>(null);
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart(); // ✅ Use global cart context

  // Determine if the product is out of stock
  const isOutOfStock = product?.stock === 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/products/detail/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchData = async ()=>  {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
        };
        const response = await axios.get('/cart/', config);
        setCart(response.data);
    };

    fetchData();
  }, [])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  // Assuming the image URL returned is relative, prepend the base URL
  const imageUrl = product.image.startsWith('http') ? product.image : ProductImagePlacehoder;

  // Define cart or remove this logic if not needed
  const isProductInCart = cart?.cart_items?.some((item) => item.product.id === product?.id) ?? false;
  
  return (
    <div className="single-product">
      <div className="single-product-header">
        <h2>{product.name}</h2>
      </div>
      <div className="product-grid">
          <Backbutton />
          <article className="product-card">
              <img src={imageUrl} alt={product.name} />
              <div className="description">
                <p>{product.description}</p>
                <p>Price: ${Number(product.price).toFixed(2)}</p>
                <p>Quantity: {product.quantity}g</p>
                <p>Stock: {product.stock}</p>
                <button
                    className='addCart'
                    onClick={() => addItem(product)}  // Pass the correct product to the handler
                    disabled={loading || isOutOfStock}
                    type="button"
                    >
                    {isProductInCart? 'InCart' : loading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>           
          </article>
      </div>
    </div>
  );
};

export default SingleProduct;
