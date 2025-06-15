import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FaPlus } from 'react-icons/fa';
import CreateCategory from './createCategory';
import './productCreate.css';

interface Category {
  id: number;
  name: string;
}

interface Product {
  name: string;
  category: string;
  stock: number;
  quantity: number;
  description: string;
  price: number;
  image: File | string;
}

interface SelectOption {
  label: string;
  value: string | number;
}

const ProductCreate: React.FC = () => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    category: '',
    stock: 0,
    quantity: 0,
    description: '',
    price: 0,
    image: '',
  });

  const [category, setCategory] = useState<SelectOption[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/products/list-category/');
        setCategory(res.data.map((cat: Category) => ({ label: cat.name, value: cat.id })));
      } catch (error) {
        console.error('Failed to fetch categories', error);
        toast.error('❌ Failed to load categories');
      }
    };

    fetchCategories();
  }, [isOpen]); // reload if new category created

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value, checked, files } = e.target as HTMLInputElement;
        if (type === 'file' && files?.[0]) {
          setFormData(prev => ({ ...prev, image: files[0] }));
        } else if (type === 'checkbox') {
          setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      };

  const handleCategoryChange = (selected: SelectOption | null) => {
    setFormData(prev => ({
      ...prev,
      category: selected ? String(selected.value) : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const form = new FormData();

    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('stock', String(formData.stock));
    form.append('quantity', String(formData.quantity));
    form.append('price', String(formData.price));
    form.append('category', formData.category);

    if (formData.image instanceof File) {
      form.append('image', formData.image);
    }

    try {
      await axios.post('/products/create/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Product created successfully!');
      setFormData({
        name: '',
        category: '',
        stock: 0,
        quantity: 0,
        description: '',
        price: 0,
        image: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('❌ Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  const onClose = () => {
    setIsOpen(!isOpen);
  }

  const CategoryCreate = () =>{
    return(
        <div className='category-create'>
            <button className="close-btn" onClick={onClose}>×</button>
            <CreateCategory />
        </div>
    )
  }

  return (
    <div className='product-form'>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            name="image"
            placeholder='image'
            title='product image'
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="image/*"
            className="form-input"
          />
          {formData.image instanceof File && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="form-preview"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            name="stock"
            placeholder='stock'
            title='number of items in stock'
            value={formData.stock}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder='quantity'
            title='number of items in quantity'
            value={formData.quantity}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            title='price in USD'
            placeholder='price'
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <Select
            placeholder="Select category"
            options={category}
            onChange={handleCategoryChange}
            className="form-select"
            value={category.find(opt => opt.value === Number(formData.category)) || null}
          />
          <button type="button" className="add-category-btn" onClick={() => handleOpen()}>
            <FaPlus /> Add Category
          </button>
        </div>

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Submitting...' : 'Create Product'}
        </button>
      </form>

      {isOpen && (
        <div className="category-create-modal">
          {CategoryCreate()}
        </div>
      )}
    </div>
  );
};

export default ProductCreate;
