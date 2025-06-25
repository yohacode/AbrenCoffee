// src/routes/AdminRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentCancel from '../pages/shop/paymentCancel';
import PaymentSuccess from '../pages/shop/pymentSuccess';
import Register from '../pages/register';
import Home from '../pages/home';
import About from '../pages/about';
import Contact from '../pages/contact';
import Login from '../pages/login';
import Logout from '../pages/logout';
import Services from '../pages/services';
import Subscription from '../pages/subscription';
import Blog from '../pages/blog/blog';
// Protected route wrapper
import type { ReactElement } from 'react';
import ProfileManagement from '../pages/profile/profileManagement';

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const isLoggedIn = localStorage.getItem('access_token');
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  return (
    <Routes>
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
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfileManagement />} />} />
    </Routes>
  );
};

export default PublicRoutes;
