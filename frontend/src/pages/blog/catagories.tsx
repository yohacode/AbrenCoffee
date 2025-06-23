// src/components/blog/catagories.tsx
import React from 'react';
import './catagories.css';

export interface BlogCategory {
  name: string;
  link: string;
}

interface CategoriesProps {
  categories: BlogCategory[];
  setCategory: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, setCategory }) => {
  if (!categories.length) return <p>Loading categories...</p>;

  return (
    <div className="blog-categories">
      <ul>
        {categories.map((c) => (
          <li key={c.name}>
            <button className="li" onClick={() => setCategory(c.link)}>
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
