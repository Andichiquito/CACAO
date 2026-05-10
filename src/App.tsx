import React, { useState, useEffect, lazy, Suspense } from 'react';
import HomePage from './components/HomePage';
import { ThemeProvider, ThemeStyles } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import FloatingCartButton from './components/FloatingCartButton';
import './App.css';

const Menu = lazy(() => import('./components/Menu'));
const Cart = lazy(() => import('./components/Cart'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const AdminProducts = lazy(() => import('./components/AdminProducts'));
const AdminTorta = lazy(() => import('./components/AdminTorta'));

// Vercel trigger
// Segundo trigger para probar el correo
type ViewType = 'home' | 'menu' | 'about' | 'settings' | 'admin-products' | 'admin-torta';

const STORAGE_KEY = 'cacao_current_view';

const AppContent: React.FC = () => {
  const getInitialView = (): ViewType => {
    try {
      const savedView = localStorage.getItem(STORAGE_KEY);
      if (savedView && ['home', 'menu', 'about', 'settings', 'admin-products', 'admin-torta'].includes(savedView)) {
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
    if (!view || !['home', 'menu', 'about', 'settings', 'admin-products', 'admin-torta'].includes(view)) {
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
      case 'admin-products':
        return <AdminProducts onNavigate={handleNavigate} onOpenCart={openCart} onOpenAuth={openAuth} />;
      case 'admin-torta':
        return <AdminTorta onNavigate={handleNavigate} />;
      case 'about':
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} onOpenCart={openCart} onOpenAuth={openAuth} />;
    }
  };

  const fallback = <div className="app-loading" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>Cargando...</div>;

  return (
    <div className="App">
      <Suspense fallback={fallback}>
        {renderCurrentView()}
        <FloatingCartButton onClick={openCart} />
        <Cart isOpen={isCartOpen} onClose={closeCart} />
        <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
      </Suspense>
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
