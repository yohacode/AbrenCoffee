// src/routes/AdminRoutes.js
import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

// Lazy-loaded pages
const Shop = lazy(() => import('../pages/shop/shop'));
const SingleProduct = lazy(() => import('../pages/shop/signleProduct'));
const Checkout = lazy(() => import('../pages/shop/checkout'));

const ShopRoutes = () => {
  return (
    <Routes>
      <Route index element={<Shop />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/:step" element={<Checkout />} /> 
    </Routes>
  );
};

export default ShopRoutes;
