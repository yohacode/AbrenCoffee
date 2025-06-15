// BlogDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import './blogDetail.css';

interface BlogDetail {
  title: string;
  image: string;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
  categories: string[];
}

const BlogDetail: React.FC = () => {
  const { id } = useParams(); // assuming your route is like /blog/:id
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blog/detail/${id}/`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to fetch blog detail:', err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  const imageUrl = blog.image.startsWith('http') ? blog.image : `http://127.0.0.1:8000${blog.image}`;

  return (
    <div className="blog-detail">
      <div className="blog-detail-header">
        <h1>{blog.title}</h1>
        <p className="author">By {blog.author_username}</p>
        <p className="date">{new Date(blog.created_at).toLocaleDateString()}</p>
        <img src={imageUrl} alt={blog.title} />
      </div>
      <div className="blog-content">
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
