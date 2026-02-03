import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import AccountSettings from './components/AccountSettings';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import FloatingCartButton from './components/FloatingCartButton';
import './App.css';

type ViewType = 'home' | 'menu' | 'about' | 'settings';

const STORAGE_KEY = 'cacao_current_view';

const AppContent: React.FC = () => {
  const getInitialView = (): ViewType => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEY);
      if (savedView && ['home', 'menu', 'about', 'settings'].includes(savedView)) {
        return savedView as ViewType;
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentView);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [currentView]);

  const openCart = (): void => setIsCartOpen(true);
  const closeCart = (): void => setIsCartOpen(false);
  const openAuth = (): void => setIsAuthOpen(true);
  const closeAuth = (): void => setIsAuthOpen(false);

  const handleNavigate = (view: ViewType): void => {
    if (!view || !['home', 'menu', 'about', 'settings'].includes(view)) {
      console.error('Invalid view provided to handleNavigate', view);
      return;
    }
    setCurrentView(view);
  };

  const renderCurrentView = (): React.ReactElement => {
    switch (currentView) {
      case 'menu':
        return <Menu onNavigate={handleNavigate} onOpenCart={openCart} onOpenAuth={openAuth} />;
      case 'settings':
        return <AccountSettings onNavigate={handleNavigate} onOpenCart={openCart} onOpenAuth={openAuth} />;
      case 'about':
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} onOpenCart={openCart} onOpenAuth={openAuth} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
      <FloatingCartButton onClick={openCart} />
      <Cart isOpen={isCartOpen} onClose={closeCart} />
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SupabaseProvider>
      <ThemeProvider defaultTheme="dark">
        <ToastProvider>
          <CartProvider>
            <ThemeStyles />
            <AppContent />
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
};

export default App;
