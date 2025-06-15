import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import './catagories.css';

interface Category {
  name: string;
  link: string;
}

interface CategoriesProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Categories: React.FC<CategoriesProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const response = await axios.get('/blog/category/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="blog-categories">
      <ul>
      {categories.map((c) => (
        <li  key={c.link}>
          <Link className='li' to={c.link}>{c.name}</Link>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default Categories;
