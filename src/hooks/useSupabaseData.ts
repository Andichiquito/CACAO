import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { Product, CartItem, CartHook, CarouselItem, CarouselHook, SmoothScrollHook } from '../types';

// Hook para manejar productos desde Supabase
export const useProducts = () => {
  const { supabase } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
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
            { 
              id: 1, 
              name: 'Café Especial', 
              description: 'Nuestro blend premium', 
              price: 15.00,
              category_id: 1,
              is_available: true,
              stock_quantity: 10,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            { 
              id: 2, 
              name: 'Cupcakes Artesanales', 
              description: 'Hechos a mano diariamente', 
              price: 8.00,
              category_id: 2,
              is_available: true,
              stock_quantity: 15,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            { 
              id: 3, 
              name: 'Croissants Frescos', 
              description: 'Horneados cada mañana', 
              price: 6.00,
              category_id: 2,
              is_available: true,
              stock_quantity: 20,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        setError(err);
        console.log('Error:', err);
        // Productos por defecto en caso de error
        setProducts([
          { 
            id: 1, 
            name: 'Café Especial', 
            description: 'Nuestro blend premium', 
            price: 15.00,
            category_id: 1,
            is_available: true,
            stock_quantity: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: 2, 
            name: 'Cupcakes Artesanales', 
            description: 'Hechos a mano diariamente', 
            price: 8.00,
            category_id: 2,
            is_available: true,
            stock_quantity: 15,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: 3, 
            name: 'Croissants Frescos', 
            description: 'Horneados cada mañana', 
            price: 6.00,
            category_id: 2,
            is_available: true,
            stock_quantity: 20,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
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

// Hook para manejar navegación suave
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

