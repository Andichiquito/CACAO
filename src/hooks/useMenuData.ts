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
      
      // Obtener categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('id');

      if (categoriesError) {
        throw categoriesError;
      }

      // Obtener productos
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
        .order('id');

      if (productsError) {
        throw productsError;
      }

      setCategories(categoriesData || []);
      setProducts(productsData || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching menu data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter(product => product.category_id === categoryId);
  };

  const getCategoryById = (categoryId: number): Category | undefined => {
    return categories.find(category => category.id === categoryId);
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

