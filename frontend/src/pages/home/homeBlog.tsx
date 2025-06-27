import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import './homeBlog.css';
import { useNavigate} from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  image: string;
  content: string;
  author_username: string;
  created_at: string;
}

const HomeBlog: React.FC = () => {
  const [blogItems, setBlogItems] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const blogPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/');
        setBlogItems(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogData();
  }, []);

  const totalPages = Math.ceil(blogItems.length / blogPerPage);

  useEffect(() => {
    if (blogItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [blogItems.length, totalPages]);

  const Next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const Preview = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentBlogs = blogItems.slice(
    currentPage * blogPerPage,
    (currentPage + 1) * blogPerPage
  );

  return (
    <div className='home-blog'>
      <div className="container">
        <h2 className="section-title">Latest from the Blog</h2>
        <p className="section-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat ccusantium, unde sunt fugit quaerat cupiditate nesciunt recusandae sapiente?</p>
        <div className="home-blog-cards">
          {blogItems.length > 0 && (
            <>
              <button
                type='button'
                title='prev'
                onClick={Preview}
                className='arrow'
                disabled={blogItems.length === 0}
              >
                <FaArrowLeftLong />
              </button>

              {currentBlogs.map((blog) => (
                <div key={blog.id} className="home-blog-card" onClick={()=> navigate(`/blog/detail/${blog.id}`)}>
                  <div className="card-content">
                    <img
                    src={blog.image}
                    alt={blog.title}
                  />
                    <h3>{blog.title}</h3>
                    <p className="meta">
                      By {blog.author_username} ·{' '}
                      {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    <p>{blog.content.slice(0, 100)}...</p>
                    <button title='readmore' className='readmore-button' onClick={()=> navigate(`/blog/detail/${blog.id}`)}>Read more...</button>
                  </div>
                </div>
              ))}

              <button
                type='button'
                title='next'
                onClick={Next}
                className='arrow'
                disabled={blogItems.length === 0}
              >
                <FaArrowRightLong />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBlog;
