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

const PublicBlog: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [blogItems, setBlogItems] = useState<BlogDetail[]>([]);
  const { id } = useParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
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
    if (id) {
      setSelectedCategoryId(parseInt(id));
    } else {
      setSelectedCategoryId(null);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchBlogData = async (category?: number) => {
      try {
        const response = await axios.get('/blog/list/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
          params: category ? { category } : {},
        });
        setBlogItems(response.data);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData(selectedCategoryId !== null ? selectedCategoryId : undefined);
  }, [selectedCategoryId]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === null) {
      navigate('/blog');
    } else {
      navigate(`/blog/category/${categoryId}`);
    }
  };

  const filteredItems = useMemo(() => {
    return selectedCategoryId
      ? blogItems.filter((item) =>
          Number(item.category) === selectedCategoryId
        )
      : blogItems;
  }, [selectedCategoryId, blogItems]);

  const allCategories: BlogCategory[] = useMemo(() => {
    const uniqueCategories = [
      ...new Map(
        blogItems.map((item) => [
          item.category,
          {
            id: Number(item.category),
            name: item.category_name,
            link: `/blog/category/${item.category}`,
          },
        ])
      ).values(),
    ];
    return uniqueCategories;
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
        <div className="blog-catagory-menu">
          <Categories 
          allCat={()=> handleCategorySelect(null)}
          categories={allCategories} 
          setCategory={handleCategorySelect} 
          />
        </div>
        
        {loading ? (
          <p className="blog-loading">Loading posts...</p>
        ) : filteredItems.length === 0 ? (
          <p className="blog-empty">No blog posts found in this category.</p>
        ) : (
          <div className="blog-grid">
            {filteredItems
              .filter((b) => b.image)
              .map((b) => {
                return (
                  <article className="blog-card" key={b.id} onClick={() => navigate(`/blog/detail/${b.id}`)}>
                    <img src={b.image} alt={b.title} className="blog-img" />
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
                          onClick={() => navigate(`blog/detail/${b.id}`)}
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

export default PublicBlog;
