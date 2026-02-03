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

      if (!supabase) {
        throw new Error('Supabase client no está disponible');
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        throw new Error(`Error al cargar categorías: ${categoriesError.message}`);
      }

      const validCategories = Array.isArray(categoriesData)
        ? categoriesData.filter((cat: any) =>
          cat &&
          typeof cat.id === 'number' &&
          cat.id > 0 &&
          typeof cat.name === 'string' &&
          cat.name.trim().length > 0
        )
        : [];

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
        .order('sort_order', { ascending: true });

      if (productsError) {
        throw new Error(`Error al cargar productos: ${productsError.message}`);
      }

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
      setError(err?.message || 'Error desconocido al cargar el menú');
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    if (typeof categoryId !== 'number' || categoryId <= 0 || !Array.isArray(products)) {
      return [];
    }

    return products.filter(product =>
      product &&
      typeof product.category_id === 'number' &&
      product.category_id === categoryId
    );
  };

  const getCategoryById = (categoryId: number): Category | undefined => {
    if (typeof categoryId !== 'number' || categoryId <= 0 || !Array.isArray(categories)) {
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
