import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

const PublicBlog = lazy(() => import('../pages/blog/blog'));
const PublicBlogDetail = lazy(() => import('../pages/blog/blogDetail'));

const BlogRoutes = () => {
  return (
    <Routes>
      <Route index element={<PublicBlog />} />
      <Route path="category/:category" element={<PublicBlog />} />
      <Route path="detail/:id" element={<PublicBlogDetail />} />
    </Routes>
  );
};

export default BlogRoutes;
