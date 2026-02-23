import React, { useState, useEffect } from 'react';
import './SimpleImageCarousel.css';

const SimpleImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images: string[] = [
    `${process.env.PUBLIC_URL || ''}/assets/images/Carrusel/IMG_6419.webp`,
    `${process.env.PUBLIC_URL || ''}/assets/images/Carrusel/IMG_6420.webp`,
    `${process.env.PUBLIC_URL || ''}/assets/images/Carrusel/IMG_6421.webp`,
    `${process.env.PUBLIC_URL || ''}/assets/images/Carrusel/IMG_6422.webp`,
    `${process.env.PUBLIC_URL || ''}/assets/images/Carrusel/IMG_6423.webp`
  ];

  // Auto-play cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = (): void => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = (): void => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  return (
    <div className="simple-image-carousel">
      {/* Imagen actual */}
      <div className="image-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Flechas */}
      <button className="arrow arrow-left" onClick={goToPrevious}>
        ‹
      </button>
      <button className="arrow arrow-right" onClick={goToNext}>
        ›
      </button>

      {/* Puntos */}
      <div className="dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleImageCarousel;


