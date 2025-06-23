// src/components/blog/Blog.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from '../../utils/axios';
import Categories, { BlogCategory } from './catagories';
import { useNavigate, useParams } from 'react-router-dom';
import './blog.css';

interface BlogDetail {
  id: number;
  title: string;
  image: string;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
  category: string;
  category_name: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const Blog: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [blogItems, setBlogItems] = useState<BlogDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { name } = useParams();
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScrollChange = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > lastScrollY.current);
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

  useEffect(() => {
    if (name) setSelectedCategory(decodeURIComponent(name));
  }, [name]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setBlogItems(response.data);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate(`/blog/category/${category}`);
  };

  const filteredItems = useMemo(() => {
    return selectedCategory
      ? blogItems.filter((item) =>
          item.category_name.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      : blogItems;
  }, [selectedCategory, blogItems]);

  const allCategories: BlogCategory[] = useMemo(() => {
    const uniqueNames = [...new Set(blogItems.flatMap((item) => item.category_name))];
    return uniqueNames.map((name) => ({
      name: name,
      link: encodeURIComponent(name),
    }));
  }, [blogItems]);

  return (
    <section className="blog">
      <header className={isScrolled ? 'blog-hero scroll' : 'blog-hero'}>
        <div className="blog-header-content">
          <h1 className="blog-title">Abren Coffee Insights</h1>
          <p className="blog-subtitle">
            Explore expert takes, brewing tips, and stories behind your favorite blends.
          </p>
        </div>
      </header>

      <main className="blog-container">
        <Categories 
          categories={allCategories} 
          setCategory={handleCategorySelect} 
          />
        {loading ? (
          <p className="blog-loading">Loading posts...</p>
        ) : filteredItems.length === 0 ? (
          <p className="blog-empty">No blog posts found in this category.</p>
        ) : (
          <div className="blog-grid">
            {filteredItems
              .filter((b) => b.image)
              .map((b) => {
                const imageUrl = b.image.startsWith('http') ? b.image : `${BASE_URL}${b.image}`;
                return (
                  <article className="blog-card" key={b.id} onClick={() => navigate(`/blogDetail/${b.id}`)}>
                    <img src={imageUrl} alt={b.title} className="blog-img" />
                    <div className="blog-content">
                      <h2 className="blog-title">{b.title}</h2>
                      <p className='category'>{b.category_name}</p>
                      <p className="blog-meta">
                        By <strong>{b.author_username}</strong> ·{' '}
                        {new Date(b.created_at).toLocaleDateString()}
                      </p>
                      <p className="blog-snippet">
                        {b.content.slice(0, 320)}...
                      </p>
                      <button
                          className="blog-readmore"
                          onClick={() => navigate(`/blogDetail/${b.id}`)}
                        >
                          Read more
                        </button>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </main>
    </section>
  );
};

export default Blog;
