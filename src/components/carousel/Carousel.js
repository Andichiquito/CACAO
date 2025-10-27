import React, { createContext, useContext } from 'react';
import { useCarousel } from '../../hooks/useSupabaseData';
import './Carousel.css';

// Context para el carrusel
const CarouselContext = createContext();

const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel components must be used within a Carousel');
  }
  return context;
};

// Componente principal del carrusel
export const Carousel = ({ 
  children, 
  items = [], 
  autoPlayInterval = 5000,
  className = '',
  onMouseEnter,
  onMouseLeave,
  ...props 
}) => {
  const carouselState = useCarousel(items, autoPlayInterval);

  const handleMouseEnter = (e) => {
    carouselState.pauseCarousel();
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    carouselState.resumeCarousel();
    onMouseLeave?.(e);
  };

  return (
    <CarouselContext.Provider value={carouselState}>
      <div 
        className={`carousel ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

// Componente para las slides
export const CarouselSlides = ({ children, className = '' }) => {
  const { currentSlide } = useCarouselContext();
  
  return (
    <div className={`carousel-slides ${className}`}>
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
};

// Componente para una slide individual
export const CarouselSlide = ({ children, className = '' }) => {
  return (
    <div className={`carousel-slide ${className}`}>
      {children}
    </div>
  );
};

// Componente para el contenido de una slide
export const CarouselContent = ({ children, className = '' }) => {
  return (
    <div className={`carousel-content ${className}`}>
      {children}
    </div>
  );
};

// Componente para el texto de una slide
export const CarouselText = ({ children, className = '' }) => {
  return (
    <div className={`carousel-text ${className}`}>
      {children}
    </div>
  );
};

// Componente para los botones de una slide
export const CarouselButtons = ({ children, className = '' }) => {
  return (
    <div className={`carousel-buttons ${className}`}>
      {children}
    </div>
  );
};

// Componente para las flechas de navegación
export const CarouselArrows = ({ className = '' }) => {
  const { prevSlide, nextSlide } = useCarouselContext();
  
  return (
    <div className={`carousel-arrows ${className}`}>
      <button 
        className="carousel-arrow carousel-arrow-left" 
        onClick={prevSlide}
        aria-label="Imagen anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        className="carousel-arrow carousel-arrow-right" 
        onClick={nextSlide}
        aria-label="Imagen siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

// Componente para los indicadores de puntos
export const CarouselDots = ({ className = '' }) => {
  const { currentSlide, goToSlide } = useCarouselContext();
  
  // Necesitamos obtener el número de slides del contexto
  const slidesCount = React.Children.count(useCarouselContext().children) || 5; // fallback
  
  return (
    <div className={`carousel-dots ${className}`}>
      {Array.from({ length: slidesCount }, (_, index) => (
        <button
          key={index}
          className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
          onClick={() => goToSlide(index)}
          aria-label={`Ir a la imagen ${index + 1}`}
        />
      ))}
    </div>
  );
};
