// src/components/blog/catagories.tsx
import React from 'react';
import './catagories.css';

export interface BlogCategory {
  id: number;
  name: string;
  link: string;
}

interface CategoriesProps {
  categories: BlogCategory[];
  setCategory: (category: number) => void;
  allCat: ()=> void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, setCategory, allCat }) => {
  if (!categories.length) return <p>Loading categories...</p>;

  return (
    <div className="blog-categories">
      <ul>
        <li><button className="li" onClick={() => allCat}>All Articles</button></li>
        {categories.map((c) => (
          <li key={c.id}>
            <button className="li" onClick={() => setCategory(c.id)}>
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
