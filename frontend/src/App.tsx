import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import axios from './utils/axios';

import { ToastContainer } from 'react-toastify';
import ScrollToTop from './routes/ScrollToTop';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import Layout from './layout';
import Cart from './pages/shop/cart';
import AdminRoutes from './routes/adminRoute';

// Protected route wrapper
import type { ReactElement } from 'react';

import BlogRoutes from './routes/blogRoute';
import ShopRoutes from './routes/shopRoute';
import PublicRoutes from './routes/publicRout';

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
        const response = await axios.get('/api/auth/status/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        const data = response.data;
        if (!data.isAuthenticated && refreshToken) {
          const response = await axios.post('api/token/refresh/', {
            headers: {
            Authorization: `Bearer ${accessToken}`,
          }
          });

          const refreshData = response.data;
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
              {/* Admin Panel (Protected) */}
              <Route path="/admin/*" element={<ProtectedRoute element={<AdminRoutes />} />} />
              {/* Shop Routes */}
              <Route path='/shop/*' element={<ShopRoutes />} />
              {/* Blog Routes */}
              <Route path="/blog/*"  element={<BlogRoutes />} />
              {/* Public Routes */}
              <Route path="/*" element={<PublicRoutes />} />
            </Routes>
          </Layout>
        </Suspense>
      </Router>
    </NavVisibilityProvider>
  );
};

export default App;
