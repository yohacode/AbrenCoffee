// src/routes/AdminRoutes.js
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
const Overview = lazy(() => import('../pages/admin/overview'));
const UsersManagement = lazy(() => import('../pages/admin/users/usersManagement'));
const OrderManagement = lazy(() => import('../pages/admin/orders/orderManagement'));

const OrderDetail = lazy(() => import('../pages/admin/orders/orderDetail'));
const ProductList = lazy(() => import('../pages/admin/product/productList'));
const ProductUpdate = lazy(() => import('../pages/admin/product/productUpdate'));
const ProductDetail = lazy(() => import('../pages/admin/product/productDetail'));
const ProductCreate = lazy(() => import('../pages/admin/product/productCreate'));
const Invoices = lazy(() => import('../pages/admin/invoice/invoiceList'));
const AddInvoice = lazy(() => import('../pages/admin/invoice/addInvoice'));
const InvoiceDetail = lazy(() => import('../pages/admin/invoice/invoiceDetail'));
const Report = lazy(() => import('../pages/admin/report/report'));
const BlogCreate = lazy(() => import('../pages/admin/blog/blogCreate'));
const BlogList = lazy(() => import('../pages/admin/blog/blogList'));
const BlogUpdate = lazy(() => import('../pages/admin/blog/blogUpdate'));

const OrderList = lazy(() => import('../pages/admin/orders/orderList'));
const OrderCreate = lazy(() => import('../pages/admin/orders/orderCreate'));
const UsersList = lazy(() => import('../pages/admin/users/usersList'));
const UserCreate = lazy(() => import('../pages/admin/users/userCreate'));
const UserUpdate = lazy(() => import('../pages/admin/users/userUpdate'));
const UserDetail = lazy(() => import('../pages/admin/users/UserDetail'));
const ProductManagement = lazy(() => import('../pages/admin/product/productMnanagement'));
const InvoiceManagement = lazy(() => import('../pages/admin/invoice/invoiceManagement'));
const BlogManagement = lazy(() => import('../pages/admin/blog/blogManagement'));
const Help = lazy(() => import('../pages/admin/help/help'));
const AdminPage = lazy(() => import('../pages/admin/adminPage'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />

        {/* Products */}
        <Route path="products" element={<ProductManagement />}>
          <Route index element={<ProductList />} />
          <Route path="add" element={<ProductCreate />} />
          <Route path="update/:id" element={<ProductUpdate />} />
          <Route path="detail/:id" element={<ProductDetail />} />
        </Route>

        {/* Users */}
        <Route path="users" element={<UsersManagement />}>
          <Route index element={<UsersList />} />
          <Route path="add" element={<UserCreate />} />
          <Route path="update/:id" element={<UserUpdate />} />
          <Route path="detail/:id" element={<UserDetail />} />
        </Route>

        {/* Orders */}
        <Route path="orders" element={<OrderManagement />}>
          <Route index element={<OrderList />} />
          <Route path="add" element={<OrderCreate />} />
          <Route path="detail/:id" element={<OrderDetail />} />
        </Route>

        {/* Invoices */}
        <Route path="invoices" element={<InvoiceManagement />}>
          <Route index element={<Invoices />} />
          <Route path="add" element={<AddInvoice />} />
          <Route path="detail/:id" element={<InvoiceDetail />} />
        </Route>

        {/* Blogs */}
        <Route path="blog" element={<BlogManagement />}>
          <Route index element={<BlogList />} />
          <Route path="add" element={<BlogCreate />} />
          <Route path="update/:id" element={<BlogUpdate />} />
        </Route>

        {/* Other */}
        <Route path="report" element={<Report />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
