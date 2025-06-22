import React from 'react'
import { useNavigate } from 'react-router-dom';
import './backButton.css';

const Backbutton:React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
    </div>
  )
}

export default Backbutton
