import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './ProductDetail.css';


interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: string;
  image: string;
  created_at: string;
}

const ProductDetail:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('Authentication token missing');
          return;
        }

        const response = await axios.get<Product>(`/products/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) throw new Error('Product not found');
        setProduct(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error('Fetch failed: ' + err.message);
        } else {
          toast.error('Fetch failed: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/products/update/${id}`);
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication token missing');
        return;
      }

      await axios.delete(`/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error('Delete failed: ' + err.message);
      } else {
        toast.error('Delete failed: An unknown error occurred');
      }
    }
  };

  if (loading) return <div>Loading product details...</div>;
  if (!product) return <div>No product data available</div>;

  return (
    <div className="product-detail">
      <h2>Product Detail</h2>
      <div className="product-detail-card">
        <img src={`http://127.0.0.1:8000/${product.image}`} alt="" />
        <div className="product-detail-info">
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="button-group mt-4">
        <button className="btn btn-primary mr-2" onClick={handleEdit}>Edit</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ProductDetail;
