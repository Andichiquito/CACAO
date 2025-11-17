import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

type ViewType = 'home' | 'menu' | 'about';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

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
      <CartProvider>
        <ThemeStyles />
        <div className="App">
          {renderCurrentView()}
          <Cart isOpen={isCartOpen} onClose={closeCart} />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;


