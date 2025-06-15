import React, { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axios';
import Categories from './catagories';
import { useParams } from 'react-router-dom';
import './blog.css';

interface BlogDetail {
  title: string;
  image: string;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
  categories: string[];
}

const Blog:React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [blogItems, setBlogItems] = useState<BlogDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { name } = useParams();
  const lastScrollY = useRef(0);

  // Track scroll direction
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
    if (name) setSelectedCategory(name);
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

  const filteredItems = selectedCategory
    ? blogItems.filter((item) => item.categories.includes(selectedCategory))
    : blogItems;

  const renderBlogItems = () => {
    if (loading) return <p className="blog-loading">Loading posts...</p>;

    if (filteredItems.length === 0) {
      return <p className="blog-empty">No blog posts found in this category.</p>;
    }

    return (
      <div className="blog-grid">
        {filteredItems
          .filter((b) => b.image)
          .map((b) => {
            const imageUrl = b.image.startsWith('http')
              ? b.image
              : `http://127.0.0.1:8000${b.image}`;

            return (
              <article className="blog-card" key={b.title}>
                <img src={imageUrl} alt={b.title} className="blog-img" />
                <div className="blog-content">
                  <h2 className="blog-title">{b.title}</h2>
                  <p className="blog-meta">
                    By <strong>{b.author_username}</strong> ·{' '}
                    {new Date(b.created_at).toLocaleDateString()}
                  </p>
                  <p className="blog-snippet">
                    {b.content.slice(0, 220)}...
                    <span className="blog-readmore"> Read more</span>
                  </p>
                </div>
              </article>
            );
          })}
      </div>
    );
  };

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
      <Categories setCategory={setSelectedCategory} />
      <main className="blog-container">{renderBlogItems()}</main>
    </section>
  );
};

export default Blog;
