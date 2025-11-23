import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product, MenuDataHook } from '../types';

export const useMenuData = (): MenuDataHook => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar que supabase esté disponible
      if (!supabase) {
        throw new Error('Supabase client no está disponible');
      }

      // Obtener categorías con validación
      // Orden personalizado: primero las categorías principales, luego las demás
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (categoriesError) {
        throw new Error(`Error al cargar categorías: ${categoriesError.message || 'Error desconocido'}`);
      }

      // Validar y filtrar categorías
      const validCategories = Array.isArray(categoriesData) 
        ? categoriesData.filter((cat: any) => 
            cat && 
            typeof cat.id === 'number' && 
            cat.id > 0 &&
            typeof cat.name === 'string' &&
            cat.name.trim().length > 0
          )
        : [];

      // Obtener productos con validación
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('is_available', true)
        .order('name');

      if (productsError) {
        throw new Error(`Error al cargar productos: ${productsError.message || 'Error desconocido'}`);
      }

      // Validar y filtrar productos
      const validProducts = Array.isArray(productsData)
        ? productsData.filter((prod: any) =>
            prod &&
            typeof prod.id === 'number' &&
            prod.id > 0 &&
            typeof prod.name === 'string' &&
            prod.name.trim().length > 0 &&
            typeof prod.price === 'number' &&
            prod.price >= 0 &&
            typeof prod.category_id === 'number' &&
            prod.category_id > 0
          )
        : [];

      setCategories(validCategories);
      setProducts(validProducts);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching menu data:', err);
      const errorMessage = err?.message || err?.toString() || 'Error desconocido al cargar el menú';
      setError(errorMessage);
      // En caso de error, establecer arrays vacíos para evitar crashes
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    // Validar entrada
    if (typeof categoryId !== 'number' || categoryId <= 0) {
      console.warn('useMenuData: Invalid categoryId provided to getProductsByCategory', categoryId);
      return [];
    }

    // Validar que products sea un array
    if (!Array.isArray(products)) {
      console.warn('useMenuData: products is not an array');
      return [];
    }

    return products.filter(product => 
      product && 
      typeof product.category_id === 'number' &&
      product.category_id === categoryId
    );
  };

  const getCategoryById = (categoryId: number): Category | undefined => {
    // Validar entrada
    if (typeof categoryId !== 'number' || categoryId <= 0) {
      console.warn('useMenuData: Invalid categoryId provided to getCategoryById', categoryId);
      return undefined;
    }

    // Validar que categories sea un array
    if (!Array.isArray(categories)) {
      console.warn('useMenuData: categories is not an array');
      return undefined;
    }

    return categories.find(category => 
      category && 
      typeof category.id === 'number' &&
      category.id === categoryId
    );
  };

  return {
    categories,
    products,
    loading,
    error,
    getProductsByCategory,
    getCategoryById,
    refetch: fetchMenuData
  };
};

