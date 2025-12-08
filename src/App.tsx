import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import FloatingCartButton from './components/FloatingCartButton';
import './App.css';

type ViewType = 'home' | 'menu' | 'about';

const STORAGE_KEY = 'cacao_current_view';

const App: React.FC = () => {
  // Restaurar la vista guardada o usar 'home' por defecto
  const getInitialView = (): ViewType => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEY);
      if (savedView && ['home', 'menu', 'about'].includes(savedView)) {
        return savedView as ViewType;
      }
    } catch (error) {
      console.error('App: Error reading from localStorage', error);
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Guardar la vista actual en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentView);
    } catch (error) {
      console.error('App: Error saving to localStorage', error);
    }
  }, [currentView]);

  const openCart = (): void => {
    setIsCartOpen(true);
  };

  const closeCart = (): void => {
    setIsCartOpen(false);
  };

  const handleNavigate = (view: 'home' | 'menu' | 'about'): void => {
    // Validar que la vista sea válida
    if (!view || !['home', 'menu', 'about'].includes(view)) {
      console.error('App: Invalid view provided to handleNavigate', view);
      return;
    }

    try {
      setCurrentView(view);
    } catch (error) {
      console.error('App: Error navigating to view', error);
    }
  };

  const renderCurrentView = (): React.ReactElement => {
    try {
      switch (currentView) {
        case 'menu':
          return <Menu onNavigate={handleNavigate} onOpenCart={openCart} />;
        case 'about':
          return <HomePage onNavigate={handleNavigate} onOpenCart={openCart} />;
        case 'home':
        default:
          return <HomePage onNavigate={handleNavigate} onOpenCart={openCart} />;
      }
    } catch (error) {
      console.error('App: Error rendering view', error);
      // Fallback a la página de inicio en caso de error
      return <HomePage onNavigate={handleNavigate} onOpenCart={openCart} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <CartProvider>
          <ThemeStyles />
          <div className="App">
            {renderCurrentView()}
            <FloatingCartButton onClick={openCart} />
            <Cart isOpen={isCartOpen} onClose={closeCart} />
          </div>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;


