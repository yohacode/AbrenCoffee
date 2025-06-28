import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaShoppingCart, FaTimes, FaUser } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../pages/shop/useCart';
import './nav.css';
import logo from '../assets/images/images/logo.png';
import userImage from '../assets/images/images/menu-4.jpg';


interface NavProps {
  onCartClick: () => void;
  isLoggedIn: boolean;
}

interface Product {
  name: string;
  id: number;
  image: string;
}

interface User {
  username: string,
  profile_image: string;
}

const Nav: React.FC<NavProps> = ({ onCartClick }) => {
  const { cartItemCount } = useCart();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [ products, setProducts] = useState<Product[]>([]);
  const [ isClicked, setIsClicked] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);   // shop
  const profileRef = useRef<HTMLDivElement>(null);    // profile
  const navRef = useRef<HTMLDivElement>(null);        // whole nav
  const location = useLocation();
  const navigate = useNavigate();
  const maxItems = 3;

  useEffect(()=> {
    const fetchProducts = async () => {
      const response = await axios.get('/products/list');
      setProducts(response.data.slice(0, maxItems));
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (isLoggedIn) fetchRoleData();
  }, [isLoggedIn]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setIsClicked(false); // only close mobile menu if clicking outside entire nav
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY == 0){
        setScrolledUp(false);
      } else {
        setScrolledUp(true);
      }
      
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsClicked(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await axios.post('/api/logout/', { refresh: token }, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
    }
  };

  const handleToggleClicked = () => {
    setIsClicked(!isClicked);
  };

  const navLinks = [
    { name: 'About AbrenCoffee', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Blog', to: '/blog' },
    { name: 'Contact', to: '/contact' },
    { name: 'Subscribtion', to: '/subscription' },
  ].filter(Boolean);

  const shopDropdown = [
    { name: 'All Products', to: '/shop' },
    { name: cartItemCount === 0 ? '':'Checkout', to: '/checkout' },
  ];

  const profileDropdown = [
    { name: isLoggedIn ? <>{user?.username}</> : '', to: '/profile' },
    role === 'admin' && isLoggedIn ? { name: 'Dashboard', to: '/adminPage' } : null,
    { name: isLoggedIn ? 'Logout' : 'Login', to: '/login', onClick: handleLogout },
    { name: isLoggedIn ? '' : 'Register', to: '/register', onClick: handleLogout },
  ].filter((item): item is { name: string; to: string; onClick?: () => Promise<void> } => item !== null);

  const sideLinks = [
    { link: '#', icon: isLoggedIn ? <img
      src={
        user?.profile_image
          ? user.profile_image
          : userImage
      }
      alt="Profile"
      className="proImage"
      loading="lazy"
    /> : <FaUser />, onClick: () => setIsProfileOpen(prev => !prev) },
    { link: '#', icon: <div className="cart">
              <small>{cartItemCount}</small>
            <FaShoppingCart /></div>, onClick: onCartClick },
  ];

  const navShopProduct = () => {
    return (
      <div className="shop-products">
        {products.length > 0 ? (
          <div className="product-imgs">
            {products.map((product) => (
                <div className="product-nav-img" key={product.id} onClick={() => navigate(`/shop/product/${product.id}`)}>
                  <img src={product.image} alt="" />
                </div>             
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    )
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, [location.pathname, setIsLoggedIn]); 

  return (
      <nav className={scrolledUp ? 'navbar scroll' : 'navbar'}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="CoffeeBlend Logo" />
          </Link>
          <div className={isClicked ? "collapse" : "collapse navbar-collapse"} id="ftco-nav">
            <ul className="navbar-nav ">
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" onClick={() => setIsOpen(prev => !prev)}>
                  Shop
                </span>
                {isOpen && (
                  <>
                    <div className="dropdown-menu" ref={dropdownRef}>
                      <ul>
                        {shopDropdown.map((item, idx) => (
                          <li key={idx}>
                            <Link className="dropdown-item" to={item.to}>
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="dropdown-img">
                        {navShopProduct()}
                      </div>
                    </div>
                  </>
                )}
              </li>

              {navLinks.map((link, idx) => (
                <li key={idx} className={`nav-item ${location.pathname.startsWith(link.to) ? 'active' : ''}`}>
                  <Link to={link.to} className="nav-link">
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>
          <div className="side">
              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  <ul>
                    {profileDropdown.map((item, idx) => (
                      <li key={idx}>
                        <Link className="dropdown-item" to={item.to} onClick={item?.onClick}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sideLinks.map((link, idx) => (
                <div className="link-group" key={idx}>
                  <Link to={link.link} className="link" onClick={e => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}>
                    <span className="icon">{link.icon}</span>
                  </Link>
                </div>
              ))}
          </div>
          <div className="navbar-toggle" onClick={handleToggleClicked}>
            {isClicked ? <FaTimes /> : <FaBars /> }
          </div>
        </div>
      </nav>
  );
};

export default Nav;