import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Gifts.css';
import { FaStar } from 'react-icons/fa';

import img from '../assets/images/bag-coffee-beans-bag-coffee-beans_962508-6092.jpg';
import img2 from '../assets/images/coffee-pack-design-minimal-white-background_1103290-1954.avif';

const giftItems = [
  {
    title: 'Starter Gift Box',
    description: 'A handpicked selection of beans and a stylish mug. Perfect for new coffee enthusiasts.',
    price: '$29.99',
    image: img,
  },
  {
    title: 'Deluxe Coffee Set',
    description: 'Includes premium beans, a grinder, and accessories for the ultimate brew-at-home experience.',
    price: '$79.99',
    image: img2,
  },
  {
    title: 'Digital Gift Card',
    description: 'Let them choose their favorite brew. Available in multiple denominations.',
    price: 'From $10',
    image: img,
  },
  {
    title: 'Barista Gift Pack',
    description: 'A curated collection for aspiring baristas, including milk frother and espresso cups.',
    price: '$49.99',
    image: img2,
  },
];

const Gifts:React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="gifts">
      <div className="gifts-container">
        <div className="gifts-hero" data-aos="fade-up">
          <h1 className="gifts-title">Perfect Coffee Gifts</h1>
          <p className="gifts-intro">
            Surprise your loved ones with curated coffee gifts that bring warmth, flavor, and joy to every cup.
          </p>
        </div>

        <div className="gift-grid">
          {giftItems.map((gift, index) => (
            <div
              className="gift-card"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              key={index}
            >
              <img src={gift.image} alt={gift.title} className="gift-img" />
              <h2>{gift.title}</h2>
              <p>{gift.description}</p>
              <span className="gift-price">{gift.price}</span>
              <div className="gift-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#ffc107" size={16} />
                ))}
              </div>
              <button className="gift-btn">Shop Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gifts;
