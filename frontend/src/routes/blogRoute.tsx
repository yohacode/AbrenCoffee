// src/routes/AdminRoutes.js
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
import Blog from '../pages/blog/blog';
const BlogUpdate = lazy(() => import('../pages/admin/blog/blogEdit'));
const BlogDetail = lazy(() => import('../pages/admin/blog/blogDetail'));

const BlogRoutes = () => {
  return (
    <Routes>
        <Route path="blog" element={<Blog />}>
            <Route index element={<Blog />} />
            <Route path="/blog/:category" element={<Blog />} />
            <Route path="/blogDetail/:id" element={<BlogDetail />} />
            <Route path="/blog/edit/:id" element={<BlogUpdate />} />
        </Route>
    </Routes>
  );
};

export default BlogRoutes;
