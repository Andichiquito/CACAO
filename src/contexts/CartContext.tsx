import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartHook } from '../types';

interface CartContextType extends CartHook {}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Función para validar un item del carrito
  const isValidCartItem = (item: any): item is CartItem => {
    return (
      item &&
      typeof item === 'object' &&
      item.product &&
      typeof item.product.id === 'number' &&
      item.product.id > 0 &&
      typeof item.product.name === 'string' &&
      item.product.name.trim().length > 0 &&
      typeof item.product.price === 'number' &&
      item.product.price >= 0 &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      item.quantity <= 1000 // Límite razonable
    );
  };

  // Cargar carrito del localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cacao-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Validar que sea un array
        if (!Array.isArray(parsedCart)) {
          console.warn('CartContext: Invalid cart data format, resetting cart');
          localStorage.removeItem('cacao-cart');
          setItems([]);
          return;
        }

        // Validar y filtrar items válidos
        const validItems = parsedCart.filter(isValidCartItem);
        
        if (validItems.length !== parsedCart.length) {
          console.warn('CartContext: Some cart items were invalid and removed');
        }

        setItems(validItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Limpiar datos corruptos
      try {
        localStorage.removeItem('cacao-cart');
      } catch (e) {
        console.error('Error removing corrupted cart data:', e);
      }
      setItems([]);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      // Validar items antes de guardar
      const validItems = items.filter(isValidCartItem);
      
      if (validItems.length !== items.length) {
        console.warn('CartContext: Some items were invalid, fixing cart');
        setItems(validItems);
        return;
      }

      if (validItems.length > 0) {
        localStorage.setItem('cacao-cart', JSON.stringify(validItems));
      } else {
        // Limpiar localStorage si el carrito está vacío
        localStorage.removeItem('cacao-cart');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // No lanzar error, solo loguear para no romper la app
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number): void => {
    // Validar producto
    if (!product) {
      console.error('CartContext: Attempted to add null/undefined product');
      return;
    }

    if (
      typeof product.id !== 'number' ||
      product.id <= 0 ||
      typeof product.price !== 'number' ||
      product.price < 0 ||
      !product.name ||
      typeof product.name !== 'string'
    ) {
      console.error('CartContext: Invalid product data', product);
      return;
    }

    // Validar cantidad
    if (typeof quantity !== 'number' || quantity <= 0 || quantity > 1000) {
      console.error('CartContext: Invalid quantity', quantity);
      return;
    }

    // Validar disponibilidad
    if (product.is_available === false) {
      console.warn('CartContext: Attempted to add unavailable product', product);
      return;
    }

    try {
      setItems(prevItems => {
        // Validar que prevItems sea un array
        if (!Array.isArray(prevItems)) {
          console.warn('CartContext: prevItems is not an array, resetting');
          return [{ product, quantity }];
        }

        const existingItem = prevItems.find(item => 
          item && item.product && item.product.id === product.id
        );
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          // Validar que la nueva cantidad no exceda límites
          if (newQuantity > 1000) {
            console.warn('CartContext: Quantity would exceed limit, capping at 1000');
            return prevItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: 1000 }
                : item
            );
          }

          return prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          // Validar que no excedamos un límite razonable de items
          if (prevItems.length >= 100) {
            console.warn('CartContext: Cart limit reached, cannot add more items');
            return prevItems;
          }
          return [...prevItems, { product, quantity }];
        }
      });
    } catch (error) {
      console.error('CartContext: Error adding to cart', error);
    }
  };

  const removeFromCart = (productId: number): void => {
    if (typeof productId !== 'number' || productId <= 0) {
      console.error('CartContext: Invalid productId provided to removeFromCart', productId);
      return;
    }

    try {
      setItems(prevItems => {
        if (!Array.isArray(prevItems)) {
          return [];
        }
        return prevItems.filter(item => 
          item && item.product && item.product.id !== productId
        );
      });
    } catch (error) {
      console.error('CartContext: Error removing from cart', error);
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (typeof productId !== 'number' || productId <= 0) {
      console.error('CartContext: Invalid productId provided to updateQuantity', productId);
      return;
    }

    if (typeof quantity !== 'number') {
      console.error('CartContext: Invalid quantity provided to updateQuantity', quantity);
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Validar límite máximo
    if (quantity > 1000) {
      console.warn('CartContext: Quantity exceeds limit, capping at 1000');
      quantity = 1000;
    }

    try {
      setItems(prevItems => {
        if (!Array.isArray(prevItems)) {
          return [];
        }

        return prevItems.map(item => {
          if (!item || !item.product) {
            return item;
          }
          return item.product.id === productId
            ? { ...item, quantity }
            : item;
        });
      });
    } catch (error) {
      console.error('CartContext: Error updating quantity', error);
    }
  };

  const clearCart = (): void => {
    try {
      setItems([]);
      localStorage.removeItem('cacao-cart');
    } catch (error) {
      console.error('CartContext: Error clearing cart', error);
    }
  };

  const getTotalPrice = (): number => {
    try {
      if (!Array.isArray(items)) {
        return 0;
      }

      return items.reduce((total, item) => {
        if (!item || !item.product) {
          return total;
        }
        const price = typeof item.product.price === 'number' ? item.product.price : 0;
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
        const itemTotal = price * quantity;
        
        // Validar que el total no sea NaN o Infinity
        if (!isFinite(itemTotal)) {
          console.warn('CartContext: Invalid item total calculated', item);
          return total;
        }
        
        return total + itemTotal;
      }, 0);
    } catch (error) {
      console.error('CartContext: Error calculating total price', error);
      return 0;
    }
  };

  const getTotalItems = (): number => {
    try {
      if (!Array.isArray(items)) {
        return 0;
      }

      return items.reduce((total, item) => {
        if (!item) {
          return total;
        }
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
        return total + quantity;
      }, 0);
    } catch (error) {
      console.error('CartContext: Error calculating total items', error);
      return 0;
    }
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

