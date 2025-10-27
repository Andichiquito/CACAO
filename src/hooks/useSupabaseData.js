import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

// Hook para manejar productos desde Supabase
export const useProducts = () => {
  const { supabase } = useSupabase();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3);
        
        if (error) {
          console.log('Error cargando productos:', error);
          // Productos por defecto si no existe la tabla
          setProducts([
            { id: 1, name: 'Café Especial', description: 'Nuestro blend premium', emoji: '☕' },
            { id: 2, name: 'Cupcakes Artesanales', description: 'Hechos a mano diariamente', emoji: '🧁' },
            { id: 3, name: 'Croissants Frescos', description: 'Horneados cada mañana', emoji: '🥐' }
          ]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        setError(err);
        console.log('Error:', err);
        // Productos por defecto en caso de error
        setProducts([
          { id: 1, name: 'Café Especial', description: 'Nuestro blend premium', emoji: '☕' },
          { id: 2, name: 'Cupcakes Artesanales', description: 'Hechos a mano diariamente', emoji: '🧁' },
          { id: 3, name: 'Croissants Frescos', description: 'Horneados cada mañana', emoji: '🥐' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [supabase]);

  return { products, loading, error };
};

// Hook para manejar el carrusel
export const useCarousel = (items, autoPlayInterval = 5000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !items.length) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, items.length, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const pauseCarousel = () => setIsPaused(true);
  const resumeCarousel = () => setIsPaused(false);

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

// Hook para manejar navegación suave
export const useSmoothScroll = () => {
  const scrollToSection = (sectionId) => {
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
