// src/routes/AdminRoutes.js
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
import Shop from '../pages/shop/shop';
import SingleProduct from '../pages/shop/signleProduct';
import Checkout from '../pages/shop/checkout';
import PaymentSuccess from '../pages/shop/pymentSuccess';
import PaymentCancel from '../pages/shop/paymentCancel';

const ShopRoutes = () => {
  return (
    <Routes>
        <Route path="/shop" element={<Shop />}>
            <Route index element={<Shop />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:step" element={<Checkout />} /> 
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
        </Route>
    </Routes>
  );
};

export default ShopRoutes;
