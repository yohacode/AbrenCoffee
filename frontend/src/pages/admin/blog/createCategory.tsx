import React, {  useRef, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './createCategory.css';

interface Category {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCategory: React.FC<Category> = ({ onClose, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked, files } = e.target;
    if (type === 'file' && files?.[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const form = new FormData();

    form.append('name', formData.name);

    try {
      await axios.post('/blog/category/create/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Blog Category created successfully!');
      setFormData({
        name: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('❌ Failed to create blog category. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      <div className={`category-create ${isOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit} className="category-form">
          <button className="close-btn" onClick={onClose}>×</button>
          
          <h2>Create Blog Category</h2>

          <div className="form-group">
              <input
              type="text"
              name="name"
              placeholder='name'
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
              />
          </div>

          <button type="submit" disabled={loading} className="category-form-button">
              {loading ? 'Submitting...' : 'Create Blog Category'}
          </button>
        </form>
      </div>
    </>
    
  );
};

export default CreateCategory;
