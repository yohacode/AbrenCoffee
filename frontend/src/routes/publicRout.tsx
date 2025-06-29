import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, type ReactElement } from 'react';

const ChangePassword = lazy(()=> import('../pages/authetentication/changePassword')) ;
const Reset = lazy(() => import('../pages/authetentication/resetPassword')) ;
const ForgetPassword = lazy(()=> import('../pages/authetentication/forgetPassword')) ;

const PaymentCancel = lazy(() => import('../pages/shop/paymentCancel'));
const PaymentSuccess = lazy(() => import('../pages/shop/pymentSuccess'));
const Register = lazy(() => import('../pages/authetentication/register'));
const Home = lazy(() => import('../pages/home/home'));
const About = lazy(() => import('../pages/about'));
const Contact = lazy(()=> import('../pages/contact'));
const Login = lazy(() => import('../pages/authetentication/login'));
const Logout = lazy(() => import('../pages/authetentication/logout'));
const Services = lazy(() => import('../pages/services'));
const Subscription = lazy(() => import('../pages/subscription/subscription'));
const Blog = lazy(() => import('../pages/blog/blog'));
const ProfileManagement = lazy(()=> import('../pages/profile/profileManagement'));

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
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:uid/:token" element={<Reset/>} />
        <Route path="/change-password" element={<ChangePassword/>} />
    </Routes>
  );
};

export default PublicRoutes;
