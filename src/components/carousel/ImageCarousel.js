import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
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

  if (!images.length) return null;

  return (
    <div 
      className="image-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen actual */}
      <div className="carousel-image-wrapper">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
      </div>

      {/* Flechas de navegación */}
      <button 
        className="nav-button nav-left"
        onClick={goToPrevious}
        aria-label="Imagen anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        className="nav-button nav-right"
        onClick={goToNext}
        aria-label="Imagen siguiente"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Indicadores */}
      <div className="indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
