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

  const renderCurrentView = (): React.ReactElement => {
    switch (currentView) {
      case 'menu':
        return <Menu onNavigate={setCurrentView} onOpenCart={openCart} />;
      case 'about':
        return <HomePage onNavigate={setCurrentView} onOpenCart={openCart} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentView} onOpenCart={openCart} />;
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


