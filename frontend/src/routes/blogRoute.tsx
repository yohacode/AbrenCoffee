import { Routes, Route } from 'react-router-dom';
import PublicBlog from '../pages/blog/blog';
import PublicBlogDetail from '../pages/blog/blogDetail';

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
