import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './blogEdit.css';
import Select, { SingleValue } from 'react-select';

interface Category {
  id: number;
  name: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
  category: Category;
  author_username: string;
  is_published: boolean;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const BlogUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Fetch Blog Info
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get<Blog>(`/blog/detail/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setBlog(data);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category ? { id: data.category.id, name: data.category.name } : null);
        setIsPublished(data.is_published);
        setPreviewImage(data.image.startsWith('http') ? data.image : `${BASE_URL}${data.image}`);
      } catch {
        toast.error('❌ Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('/blog/category/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch {
        toast.error('❌ Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = (selected: SingleValue<{ value: number; label: string }>) => {
    if (selected) {
      setCategory({ id: selected.value, name: selected.label });
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!category) return toast.error('Please select a category.');

      const token = localStorage.getItem('access_token');
      const formData = new FormData();

      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category.id.toString());
      formData.append('is_published', isPublished ? 'true' : 'false');

      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/blog/update/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('✅ Blog updated successfully!');
      console.log('Update response:', response.data);
      navigate(-2);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update blog.');
    }
  };

  if (loading) return <div className="center-text">Loading blog info...</div>;
  if (!blog) return <div className="center-text error">Blog not found</div>;

  return (
    <div className="update-container">
      <h2 className="update-title">Update Blog</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter blog title"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            placeholder="Enter blog content"
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: '120px', marginBottom: '8px', borderRadius: '6px' }}
            />
          )}
          <input
            title='Upload an image'
            accept="image/*"
            type="file"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <Select
            placeholder="Select category"
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
            onChange={handleCategoryChange}
            value={
              category
                ? { value: category.id, label: category.name }
                : null
            }
          />
        </div>

        <div className="form-checkbox">
          <input
            placeholder='publish'
            type="checkbox"
            checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
          />
          <label>Publish</label>
        </div>

        <div className="button-group">
          <button type="button" onClick={() => navigate(-1)} className="back-button">← Back</button>
          <button type="submit" className="submit-button">Update Blog</button>
        </div>
      </form>
    </div>
  );
};

export default BlogUpdate;
