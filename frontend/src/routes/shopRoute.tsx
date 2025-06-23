// src/routes/AdminRoutes.js
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
import Shop from '../pages/shop/shop';
import SingleProduct from '../pages/shop/signleProduct';
import Checkout from '../pages/shop/checkout';

const ShopRoutes = () => {
  return (
    <Routes>
        <Route path="/shop" element={<Shop />}>
            <Route index element={<Shop />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:step" element={<Checkout />} /> 
        </Route>
    </Routes>
  );
};

export default ShopRoutes;
