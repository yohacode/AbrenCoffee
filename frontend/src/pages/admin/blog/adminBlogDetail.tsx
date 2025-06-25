import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './adminBlogDetail.css';

interface Category {
  id: number;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  category: Category;
  category_name: string;
  author_username: string;
  image: string;
  created_at: string;
}

const AdminBlogDetail:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('Authentication token missing');
          return;
        }

        const response = await axios.get<Blog>(`/blog/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) throw new Error('Blog not found');
        setBlog(response.data);
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

    fetchBlog();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/blog/update/${id}`);
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this blog?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication token missing');
        return;
      }

      await axios.delete(`/blogs/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Blog deleted successfully');
      navigate('/blogs');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error('Delete failed: ' + err.message);
      } else {
        toast.error('Delete failed: An unknown error occurred');
      }
    }
  };

  if (loading) return <div>Loading blog details...</div>;
  if (!blog) return <div>No blog data available</div>;

  return (
    <div className="blog-detail">
      <h2><strong>Title:</strong> {blog.title}</h2>
      <div className="blog-detail-card">
        <img src={`http://127.0.0.1:8000/${blog.image}`} alt="" />
        <div className="blog-detail-info">
          <p><strong>Author:</strong> {blog.author_username}</p>
          <p><strong>Category:</strong> {blog.category_name}</p>
          <p><strong>Created At:</strong> {new Date(blog.created_at).toLocaleString()}</p>
          <p><strong>Content:</strong> {blog.content}</p>
        </div>
      </div>

      <div className="button-group mt-4">
        <button className="btn btn-primary mr-2" onClick={handleEdit}>Edit</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default AdminBlogDetail;
