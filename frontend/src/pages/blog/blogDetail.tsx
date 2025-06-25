import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import './blogDetail.css';
import Backbutton from '../../component/backbutton';
import BlogComment from '../../component/blogComment';

interface BlogDetail {
  id: number;
  title: string;
  image: string;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
  categories: string[];
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

interface Comment {
  id: number;
  content: string;
  author: string;
  author_username: string;
  created_at: string | number;
}

const PublicBlogDetail: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blog/detail/${id}/`);

        const result = res.data[0];
        setBlog(result.blog);
        setComments(result.comments || []);
        console.log('Blog fetched:', result.comments);
      } catch (err) {
        console.error('Failed to fetch blog detail:', err);
        setError('Failed to load the blog post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (commentText: string) => {
    if (!commentText.trim()) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post(
        `/blog/comment/create/${id}/`,
        { content: commentText},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setComments((prev) => [...prev, res.data]); 
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  if (loading) return <p className="blog-loading">Loading post...</p>;
  if (error) return <p className="blog-error">{error}</p>;
  if (!blog) return <p className="blog-empty">No blog post found.</p>;

  const imageUrl = blog.image.startsWith('http') ? blog.image : `${BASE_URL}${blog.image}`;

  return (
    <article className="blog-detail">
      <Backbutton />
      
      <section className="blog-detail-body">
        <header className="blog-detail-header">
          <h1 className="blog-detail-title">{blog.title}</h1>
        </header>
        <img src={imageUrl} alt={blog.title} className="blog-detail-image" />
        <div className="blog-detail-content">
          <p className="blog-detail-meta">
            By <strong>{blog.author_username ? blog.author_username : 'Anonymus'}</strong> ·{' '}
            {new Date(blog.created_at).toLocaleDateString()}
          </p>
          {blog.content}
        </div>
        <BlogComment 
          comments={comments.map(comment => ({
            ...comment, 
            
            created_at: typeof comment.created_at === 'string' ? Date.parse(comment.created_at) : comment.created_at
          }))}
          onCommentSubmit={handleCommentSubmit} 
        />
      </section>
    </article>
  );
};

export default PublicBlogDetail;
