import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { CarouselItem, CarouselHook, SmoothScrollHook } from '../types';

export const useCarousel = (items: CarouselItem[], autoPlayInterval: number = 5000): CarouselHook => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused || !items.length) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, items.length, autoPlayInterval]);

  const nextSlide = (): void => {
    setCurrentSlide(prev => (prev + 1) % items.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide(prev => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  const pauseCarousel = (): void => setIsPaused(true);
  const resumeCarousel = (): void => setIsPaused(false);

  return {
    currentSlide,
    isPaused,
    nextSlide,
    prevSlide,
    goToSlide,
    pauseCarousel,
    resumeCarousel
  };
};

export const useSmoothScroll = (): SmoothScrollHook => {
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return { scrollToSection };
};
