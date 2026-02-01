import React, { useState, useEffect } from 'react';
import './SimpleImageCarousel.css';

const SimpleImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images: string[] = [
    "/assets/images/carrusel/IMG_6419.PNG",
    "/assets/images/carrusel/IMG_6420.PNG",
    "/assets/images/carrusel/IMG_6421.PNG",
    "/assets/images/carrusel/IMG_6422.PNG",
    "/assets/images/carrusel/IMG_6423.PNG"
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


