import React, { useEffect, useState } from 'react';
import './footer.css';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  date: string;
  author: string;
  author_username: string;
  comments: number;
  image: string;
}

const Footer: React.FC = () => {
  const [blogItems, setBlogItems] = useState<Blog[]>([]);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('blog/list/');
        setBlogItems(response.data.slice(0, 3));
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogData();
  }, []);

  // Scroll to top functionality
  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 300) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 300) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showScroll]);

  return (
    <footer className="footer">
      <div className="footer__overlay"></div>
      <div className="footer__container">
        <div className="footer__row">

          {/* About Us */}
          <div className="footer__column">
            <h2 className="footer__heading">About Us</h2>
            <p className="footer__text">
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
            </p>
            <div className="footer__social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Recent Blog */}
          <div className="footer__column">
            <h2 className="footer__heading">Recent Blog</h2>
            <div className="footer__blog">
              {blogItems.map((blog) => (
                <div className="footer__blog-item" key={blog.id} onClick={()=> navigate(`/blog/detail/${blog.id}`)}>
                  <img src={blog.image} alt="" className="footer__blog-img" />
                  <div className="footer__blog-text">
                    <a href="#">{blog.title}</a>
                    <div className="footer__meta">
                      <span>📅 {blog.date}</span>
                      <span>👤 {blog.author_username}</span>
                      <span>💬 {blog.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="footer__column">
            <h2 className="footer__heading">Services</h2>
            <ul className="footer__list">
              <li><a href="#">Cooked</a></li>
              <li><a href="#">Deliver</a></li>
              <li><a href="#">Quality Foods</a></li>
              <li><a href="#">Mixed</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__column">
            <h2 className="footer__heading">Have a Questions?</h2>
            <ul className="footer__contact">
              <li>📍 Addis Ababa, Ethiopia</li>
              <li>📞 +251965500734 / +251996081457</li>
              <li>✉️ Library Creatives Design</li>
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Abren Coffee. All rights reserved.</p>
        </div>

        {/* Scroll to Top Button */}
        <button
          className={`scrollTop ${showScroll ? 'show' : ''}`}
          onClick={scrollTop}
          aria-label="Scroll to Top"
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
