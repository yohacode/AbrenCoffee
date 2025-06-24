import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { ToastContainer } from 'react-toastify';
import ScrollToTop from './routes/ScrollToTop';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import Layout from './layout';
import Cart from './pages/shop/cart';
import AdminRoutes from './routes/adminRoute';

// Lazy loaded pages
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));
const Contact = lazy(() => import('./pages/contact'));
const Login = lazy(() => import('./pages/login'));
const Logout = lazy(() => import('./pages/logout'));
const Services = lazy(() => import('./pages/services'));
const Subscription = lazy(() => import('./pages/subscription'));

const Shop = lazy(() => import('./pages/shop/shop'));
const Blog = lazy(() => import('./pages/blog/blog'));

const Profile = lazy(() => import('./pages/profile/profileManagement'));

// Protected route wrapper
import type { ReactElement } from 'react';
import PaymentSuccess from './pages/shop/pymentSuccess';
import PaymentCancel from './pages/shop/paymentCancel';
import Register from './pages/register';

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const isLoggedIn = localStorage.getItem('access_token');
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Check authentication status & refresh token if needed
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/status/', {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });

        const data = await response.json();
        if (!data.isAuthenticated && refreshToken) {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
            credentials: 'include',
          });

          const refreshData = await refreshResponse.json();
          if (refreshData.access) {
            localStorage.setItem('access_token', refreshData.access);
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <NavVisibilityProvider>
      <Router>
        <Cart isOpen={isCartOpen} onClose={closeCart} />
        <ToastContainer position="bottom-right" autoClose={3000} />
        <Suspense fallback={<div className="main">Loading Page...</div>}>
          <ScrollToTop />
          <Layout
            isCartOpen={isCartOpen}
            openCart={openCart}
            closeCart={closeCart}
            isLoggedIn={!!localStorage.getItem('access_token')}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/cancel" element={<PaymentCancel />} />

              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              {/* Shop Routes */}
              <Route path='/shop/*' element={<Shop />} />
              {/* Blog Routes */}
              <Route path="/blog/*"  element={<Blog />} />
              {/* Admin Panel (Protected) */}
              <Route path="/*" element={<ProtectedRoute element={<AdminRoutes />} />} />
            </Routes>

          </Layout>
        </Suspense>
      </Router>
    </NavVisibilityProvider>
  );
};

export default App;
