import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './productUpdate.css'; // Import external CSS

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: string;
  quantity: number;
  created_at: string;
  is_subscription: boolean;
}

const ProductUpdate:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscription, setIsSubscription] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get<Product>(`/products/detail/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProduct(data);
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category);
        setStock(data.stock);
        setQuantity(data.quantity);
        setDescription(data.description);
        setIsSubscription(data.is_subscription);
        setPreviewImage(data.image.startsWith('http') ? data.image : `${import.meta.env.VITE_BACKEND_URL}${data.image}`);
      } catch {
        toast.error('Fetch failed: ');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    formData.append('is_subscription', isSubscription ? 'true' : 'false');

    if (image) {
      formData.append('image', image);
    }
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `/products/update/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Product updated successfully');
      navigate(-2);
    } catch {
      toast.error('Update failed: ');
    }
  };

  if (loading) return <div className="center-text">Loading product info...</div>;
  if (!product) return <div className="center-text error">Product not found</div>;

  return (
    <div className="update-container">
      <h2 className="update-title">Update Product</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            title='name'
            value={name} 
            onChange={e => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input 
            type="number"
            title='price'
            value={price} 
            onChange={e => setPrice(parseFloat(e.target.value))} required />
        </div>

        <div className="form-group">
          <label>Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: '12em', marginBottom: '8px', borderRadius: '6px' }}
            />
          )}
          <input 
            type="file"
            title='image'
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }
            }} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input 
            type="text"
            title='description'
            value={description}
            onChange={e => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input 
            type="text" 
            title='category'
            value={category}
             onChange={e => setCategory(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input 
            type="text" 
            title='stock'
            value={stock}
             onChange={e => setStock(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input 
            type="text" 
            title='quantity'
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))} required />
        </div>

        <div className="form-group">
          <label>Is Subscription</label>
          <input 
            type="checkbox"
            title='is_subscription'
            checked={isSubscription}
            value={isSubscription ? 'true' : 'false'}
            onChange={e => setIsSubscription(e.target.checked)} />
        </div>

        <button type="submit" className="submit-button">Update Product</button>
      </form>
    </div>
  );
};

export default ProductUpdate;
