import React, { useState, useEffect } from 'react';
import './SimpleCarousel.css';

const SimpleCarousel = ({ items = [], autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, items.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div 
      className="simple-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen principal */}
      <div className="carousel-image-container">
        <img 
          src={currentItem.url} 
          alt={currentItem.title}
          className="carousel-image"
        />
      </div>

      {/* Flechas de navegación */}
      <button 
        className="carousel-nav carousel-nav-left"
        onClick={goToPrevious}
        aria-label="Imagen anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        className="carousel-nav carousel-nav-right"
        onClick={goToNext}
        aria-label="Imagen siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Indicadores de puntos */}
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleCarousel;
