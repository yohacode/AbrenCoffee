import React from 'react';
import './CheckoutStepper.css';

const steps = ['Shipping', 'Review', 'Payment'];

const CheckoutStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="checkout-stepper">
      {steps.map((label, index) => (
        <div key={index} className={`step ${currentStep === index ? 'active' : currentStep > index ? 'complete' : ''}`}>
          <div className="circle">{index + 1}</div>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
};

export default CheckoutStepper;
