import React, { useEffect, useRef, useState } from 'react';
import './hotDrinks.css';
import img1 from '../../assets/images/R.jpeg';
import img2 from '../../assets/images/coffee12.png';
import img3 from '../../assets/images/esspereso.png';

const HotDrink: React.FC = () => {
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
    
  const handleScrollChange = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current) {
      setScrolledUp(true); // User is scrolling up
    } else {
      setScrolledUp(false); // User is scrolling down
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollChange);
    return () => window.removeEventListener('scroll', handleScrollChange);
  }, []);

    const drinks = [
        {name: 'Espresso', description: 'The day you want to refresh yourself', img: img1},
        {name: 'Cappuccino', description: 'The day you want to refresh yourself', img: img2},
        {name: 'Latte', description: 'The day you want to refresh yourself', img: img3},
    ]

  return (
    <div className='hot_drinks'>
      {drinks.map((drink, index)=> (
        <div className={scrolledUp ? "drink_card scrolled" : "drink_card" }key={index}>
            <img src={drink.img} alt={drink.name} />
            <div className="detail">
                <h2>{drink.name}</h2>
                <p>{drink.description}</p>
            </div>
        </div>
      ))}
    </div>
  )
}

export default HotDrink
