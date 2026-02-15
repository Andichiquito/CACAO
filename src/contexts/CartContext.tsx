import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartHook } from '../types';
import { useToast } from './ToastContext';
import { getProductDisplayName } from '../utils/security';

interface CartContextType extends CartHook { }

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

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
      item.quantity <= 1000
    );
  };

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cacao-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
          localStorage.removeItem('cacao-cart');
          setItems([]);
          return;
        }

        const validItems = parsedCart.filter(isValidCartItem);
        setItems(validItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cacao-cart');
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      const validItems = items.filter(isValidCartItem);

      if (validItems.length !== items.length) {
        setItems(validItems);
        return;
      }

      if (validItems.length > 0) {
        localStorage.setItem('cacao-cart', JSON.stringify(validItems));
      } else {
        localStorage.removeItem('cacao-cart');
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number): void => {
    if (!product || typeof product.id !== 'number' || product.id <= 0 ||
      typeof product.price !== 'number' || product.price < 0 || !product.name) {
      console.error('Invalid product data', product);
      return;
    }

    if (typeof quantity !== 'number' || quantity <= 0 || quantity > 1000) {
      console.error('Invalid quantity', quantity);
      return;
    }

    if (product.is_available === false) {
      return;
    }

    try {
      setItems(prevItems => {
        if (!Array.isArray(prevItems)) {
          return [{ product, quantity }];
        }

        const existingItem = prevItems.find(item => item?.product?.id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, 1000);
          return prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          if (prevItems.length >= 100) {
            return prevItems;
          }
          return [...prevItems, { product, quantity }];
        }
      });

      const displayName = getProductDisplayName(product);
      showToast('Producto agregado', `${displayName} se agregó al carrito`);
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const removeFromCart = (productId: number): void => {
    if (typeof productId !== 'number' || productId <= 0) {
      return;
    }

    try {
      setItems(prevItems => {
        if (!Array.isArray(prevItems)) {
          return [];
        }
        return prevItems.filter(item => item?.product?.id !== productId);
      });
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (typeof productId !== 'number' || productId <= 0 || typeof quantity !== 'number') {
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const cappedQuantity = Math.min(quantity, 1000);

    try {
      setItems(prevItems => {
        if (!Array.isArray(prevItems)) {
          return [];
        }

        return prevItems.map(item => {
          if (!item?.product) return item;
          return item.product.id === productId
            ? { ...item, quantity: cappedQuantity }
            : item;
        });
      });
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const clearCart = (): void => {
    try {
      setItems([]);
      localStorage.removeItem('cacao-cart');
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const getTotalPrice = (): number => {
    try {
      if (!Array.isArray(items)) {
        return 0;
      }

      return items.reduce((total, item) => {
        if (!item?.product) return total;
        const price = typeof item.product.price === 'number' ? item.product.price : 0;
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
        const itemTotal = price * quantity;

        if (!isFinite(itemTotal)) return total;
        return total + itemTotal;
      }, 0);
    } catch (error) {
      console.error('Error calculating total price', error);
      return 0;
    }
  };

  const getTotalItems = (): number => {
    try {
      if (!Array.isArray(items)) {
        return 0;
      }

      return items.reduce((total, item) => {
        if (!item) return total;
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
        return total + quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total items', error);
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
