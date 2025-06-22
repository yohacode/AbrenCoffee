import React from 'react';
import './Services.css';
import {
  FaRocket,
  FaCoffee,
  FaShippingFast,
  FaCogs,
  FaCheckCircle
} from 'react-icons/fa';
import usImage from '../assets/images/images/ytr.jpg';

const Services:React.FC = () => {
  const testimonials = [
    {
      name: 'Maria S.',
      feedback: 'Abren transformed our office coffee culture—smooth, delicious, and always hot!',
    },
    {
      name: 'Derek J.',
      feedback: 'I love the seasonal specials. They’re fresh and unique every time.',
    },
  ];

  return (
    <div className="services">
      <div className="services-container">
        {/* Hero Section */}
        <div className="service-hero">
          <h1 className="services-title">Our Services</h1>
          <p className="services-intro">
            At Abren, we offer a range of services tailored to meet your needs in digital commerce and technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          <div className="service-card">
            <FaRocket className="service-icon" />
            <h2>Subscription</h2>
            <p>
              We build scalable and responsive websites using modern technologies like React, Django, and Node.js.
            </p>
          </div>

          <div className="service-card">
            <FaCoffee className="service-icon" />
            <h2>Coffee for the Office</h2>
            <p>
              Complete e-commerce platforms with payment integration, cart systems, order tracking, and more.
            </p>
          </div>

          <div className="service-card">
            <FaShippingFast className="service-icon" />
            <h2>Hot Delivery</h2>
            <p>
              Beautiful, user-friendly interface design with a focus on usability, accessibility, and engagement.
            </p>
          </div>

          <div className="service-card">
            <FaCogs className="service-icon" />
            <h2>Coffee Production</h2>
            <p>
              Improve your online presence with search engine optimization and detailed analytics reports.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us">
          <img src={usImage} alt="" className="image" />
          <div className="content">
            <h2>Why Choose Abren?</h2>
            <ul>
              <li><FaCheckCircle className="check-icon" /> Decades of collective experience</li>
              <li><FaCheckCircle className="check-icon" /> High-performance technology stack</li>
              <li><FaCheckCircle className="check-icon" /> Customer-first service model</li>
              <li><FaCheckCircle className="check-icon" /> Seamless integration with your operations</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="services-cta">
          <h2>Ready to transform your coffee and commerce experience?</h2>
          <p>Contact our team to get started with a custom plan tailored to your needs.</p>
          <button className="cta-button">Contact Us</button>
        </div>

        <section className="testimonials-section" data-aos="fade-up">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <div className="testimonial-card" key={index} data-aos="fade-right">
                <p className="testimonial-feedback">"{t.feedback}"</p>
                <p className="testimonial-name">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
