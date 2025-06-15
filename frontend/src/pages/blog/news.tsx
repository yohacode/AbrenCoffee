import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

interface Detail {
  title: string;
  image_url: string;
  content: string;
  author: string;
  created_at: string;
}

const News:React.FC = () => {
  const [newsItems, setNewsItems] = useState<Detail[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/blog/list/?tag=News');
        setNewsItems(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className='blog-news'>
      <h1>News</h1>
      <div className='blog-container'>
        {newsItems.length > 0 ? (
          newsItems.map((b, i) => (
            <div className='blog-card' key={i}>
              <img src={`http://127.0.0.1:8000${b.image_url}`} alt={b.title} />
              <h3>{b.title}</h3>
              <p className='author'>By {b.author}</p>
              <p className='date'>{new Date(b.created_at).toLocaleDateString()}</p>
              <p>{b.content.slice(0, 150)}...</p>
            </div>
          ))
        ) : (
          <p>No news posts found.</p>
        )}
      </div>
    </div>
  );
};

export default News;
