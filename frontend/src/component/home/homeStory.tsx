import { useState, useEffect } from 'react';
import './homeStory.css';
import img1 from '../../assets/images/pngtree-vintage-handgrinded-coffee-powder-packed-in-a-box-photo-image_31431962.jpg';
import img2 from '../../assets/images/roasted-coffee-beans-free-photo.jpg';
import img3 from '../../assets/images/Packaging-Coffee-Beans-1920-x-1080px-1600x900.webp';

const HomeStory = () => {
  const story = [
      {
        title: 'Our Story',
        image: img1,
        description:
          'Our journey began with a simple passion for exceptional coffee and a commitment to community. From humble beginnings as a small local café, we’ve grown into a beloved space where quality, sustainability, and hospitality come together. Every cup tells a story of dedication, craft, and connection.',
      },
      {
        title: 'Our Coffee',
        image: img2,
        description:
          'We source our beans from trusted farms around the globe, ensuring every roast meets our high standards for flavor and ethics. Our baristas are true artisans, trained to highlight the unique notes of each blend—whether it’s a velvety espresso, a pour-over, or a creamy cappuccino.',
      },
      {
        title: 'Fine Teas',
        image: img3,
        description:
          'Beyond coffee, we offer a curated selection of fine teas—from calming herbal infusions to bold black and earthy green varieties. Our teas are hand-picked and expertly steeped, offering a refined experience for those seeking comfort, clarity, or a mindful break from the day.',
      },
  ];      

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % story.length);
    }, 5000); 
    return () => clearInterval(interval); // cleanup
  }, [story.length]);

  return (
    <div className="story">
      <div className="story-card">
        <img src={story[currentSlide].image} alt={story[currentSlide].title} className="story-image" />
        <div className="description">
            <h2>{story[currentSlide].title}</h2>
            <p>{story[currentSlide].description}</p>
            <button>Learn More</button>
        </div>
        
      </div>
    </div>
  );
};

export default HomeStory;
