import React from 'react'
import './RandomInfo.css' // Import the external CSS file
import {
    FaCoffee,
    FaLeaf,
    FaBreadSlice,
    FaUtensils,
  } from 'react-icons/fa'

const RandomInfo:React.FC = () => {
    const info = [
        // Coffee-related
        {
          title: 'Best Coffee',
          icon: FaCoffee,
          description: 'We serve premium, ethically sourced coffee brewed to perfection.',
        },
        {
            title: 'Fine Teas',
            icon: FaLeaf,
            description: 'Explore our collection of organic green, black, and herbal teas.',
          },
      
        // Pastry-related
        {
          title: 'Fresh Pastries',
          icon: FaBreadSlice,
          description: 'From croissants to cinnamon rolls, our pastries are baked fresh daily.',
        },

      
        // Café Menu-related
        {
          title: 'Seasonal Specials',
          icon: FaUtensils,
          description: 'Our rotating menu features seasonal, locally sourced ingredients.',
        },
      ]

    return (
        <>
            <div className="info-header">
                <h1>Drink & Enjoy Your life!</h1>
            </div>
            <div className="info-container">
                {info.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <div key={index} className="info-card">
                            <Icon className="info-icon" />
                            <h3 className="info-title">{item.title}</h3>
                            <p className="info-description">{item.description}</p>
                        </div>
                    )
                })}
            </div>
        </>
        
    )
}

export default RandomInfo
