import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import Select from 'react-select';
import './blogCreate.css';
import CreateCategory from './createCategory';
import { FaPlus } from 'react-icons/fa';
import { MultiValue} from 'react-select';


interface Category {
  id: number;
  name: string;
}

interface Blog {
  title: string;
  image: File | string;
  content: string;
  category: number;
  is_published: boolean;
}


const BlogCreate: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Blog>({
    title: '',
    image: '',
    content: '',
    category: 1,
    is_published: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/blog/category/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch {
        toast.error('❌ Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

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

  
  const handleCategoryChange = (
    selected: MultiValue<{ value: number; label: string }>
  ) => {
    setFormData(prev => ({
      ...prev,
      categories: selected.map(opt => Number(opt.value)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const form = new FormData();

    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('is_published', String(formData.is_published));

    form.append('category', String(formData.category));

    if (formData.image instanceof File) {
      form.append('image', formData.image);
    }

    try {
      await axios.post('/blog/create/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Blog created successfully!');
      setFormData({
        title: '',
        image: '',
        content: '',
        category: 1,
        is_published: false,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('❌ Failed to create blog. Please try again.');
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
    <>
      <form onSubmit={handleSubmit} className="blog-form">
        <h2>Create New Blog</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder='title'
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <input
            type='textArea'
            name='content'
            placeholder='content'
            className='form-input'
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            title='file'
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="image/*"
            className="form-input"
            required
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
          <label>Categories <button onClick={()=> handleOpen()}><FaPlus/> Add</button></label>
          <Select
            isMulti
            placeholder="Select categories"
            onChange={handleCategoryChange}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="is_published"
            placeholder='is_published'
            checked={formData.is_published}
            onChange={handleInputChange}
          />
          <label htmlFor="is_published">Publish Immediately</label>
        </div>

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Submitting...' : 'Create Blog'}
        </button>
      </form>
      {isOpen ? (
        <div className="category-create">
          {CategoryCreate()}
        </div>
      ) : (
        <></>
      )}
    </>
    
  );
};

export default BlogCreate;
