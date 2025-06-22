import { useState, useEffect } from "react";
import "./happyCustomer.css";
import img1 from "../../assets/images/images/person_2.jpg";
import img2 from "../../assets/images/images/person_3.jpg";
import img3 from "../../assets/images/images/person_4.jpg";

const data = [
  { quote: "Great service!", name: "Alice", position: "Designer", image: img1 },
  { quote: "Loved the experience.", name: "Bob", position: "Developer", image: img2 },
  { quote: "Highly recommended!", name: "Charlie", position: "Marketer", image: img3 },
];

const TestimonySlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const prev = (current - 1 + data.length) % data.length;
  const next = (current + 1) % data.length;

  return (
    <div className="slider">
      <h1>Testimony</h1>
      {data.map((item, index) => {
        let className = "card";

        if (index === current) className += " active";
        else if (index === prev) className += " prev";
        else if (index === next) className += " next";
        else className += " hidden";

        return (
          <div key={index} className={className}>
            <img src={item.image} alt={item.name} />
            <div className="text">
              <h3>{item.name}</h3>
              <p>{item.position}</p>
              <q>{item.quote}</q>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestimonySlider;
