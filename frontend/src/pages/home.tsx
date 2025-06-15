import React, { useEffect, useState } from 'react';
import './home.css'; // Make sure this path matches your file structure
import { Link} from 'react-router-dom';
import Trending_products from '../component/home/trending_products';

import HomeBlog from '../component/home/homeBlog';
import HappyCustomers from '../component/home/happyCustomers';
import HomeRegister from '../component/home/homeRegister';

import bg1 from '../assets/images/images/bg_1.jpg';
import bg2 from '../assets/images/images/bg_2.jpg';
import bg3 from '../assets/images/images/bg_3.jpg';
import OurStory from '../component/home/ourstory';
import CounterSection from '../component/home/countersection';

const Home: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const bgSlide = [
        {img: bg1, alt:''},
        {img: bg2, alt:''},
        {img: bg3, alt:''},
    ]

    useEffect(()=> {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % bgSlide.length);
        }, 3000);

        return () =>  clearInterval(interval);
    }, []);

    return (
        <div className="home-section" 
               >
            <div className="home-content" 
                style={{
                backgroundImage: `url(${bgSlide[current].img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-image 1s ease-in-out',
                }}
            >
                <span className="mb-4">Abren Coffee</span>
                <p className="mb-4 mb-md-5">A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                <Link to={'/shop'} className="shop-button">
                   Shop Now
                </Link>
            </div>
            <Trending_products />
            <CounterSection />
            <OurStory />
            <HomeBlog /> 
            <HappyCustomers />
            <HomeRegister />
        </div>
    );
};

export default Home;
