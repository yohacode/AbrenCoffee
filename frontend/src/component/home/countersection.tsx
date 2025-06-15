// CounterSection.tsx
import { useEffect, useState } from 'react';
import './countersection.css';
import { FaCoffee } from 'react-icons/fa';

type CounterProps = {
  iconClass: string;
  target: number;
  label: string;
};

const Counter = ({ iconClass, target, label }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 50); // update every 50ms

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        setCount(target);
      } else {
        setCount(Math.ceil(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="counter-wrap">
      <div className="text">
        <div className="icon">
          <span className={iconClass}><FaCoffee /></span>
        </div>
        <strong className="number">{count}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
};

export default function CounterSection() {
  return (
    <section className="ftco-counter" id="section-counter">
      <div className="overlay"></div>
      <div className="container">
        <div className="row">
          <Counter iconClass="flaticon-coffee-cup" target={100} label="Coffee Branches" />
          <Counter iconClass="flaticon-coffee-cup" target={85} label="Number of Awards" />
          <Counter iconClass="flaticon-coffee-cup" target={10567} label="Happy Customers" />
          <Counter iconClass="flaticon-coffee-cup" target={900} label="Staff" />
        </div>
      </div>
    </section>
  );
}
