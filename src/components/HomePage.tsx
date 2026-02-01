import React, { useState, useEffect } from 'react';
import SimpleImageCarousel from './carousel/SimpleImageCarousel';
import AboutUs from './AboutUs';
import { useCart } from '../hooks/useCart';
import { HomePageProps } from '../types';
import './HomePage.css';


declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenCart, onOpenAuth }) => {

  // const { user } = useSupabase(); // 'user' is currently unused because the related JSX block is commented out.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();


  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#about') {

      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);


    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }


      setTimeout(() => {
        const instagramLinks = document.querySelectorAll('.instagram-media a');
        instagramLinks.forEach((link: Element) => {
          const anchor = link as HTMLAnchorElement;
          if (anchor) {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
          }
        });
      }, 1000);
    };

    return () => {

      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);


  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };


  const handleOpenCart = (): void => {
    try {
      if (onOpenCart && typeof onOpenCart === 'function') {
        onOpenCart();
      } else {
        console.warn('HomePage: onOpenCart is not a valid function');
      }
    } catch (error) {
      console.error('HomePage: Error opening cart', error);
    }
  };


  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('HomePage: onNavigate prop is required and must be a function');
    return (
      <div className="homepage">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
          <p>Error de configuración. Por favor, recarga la página.</p>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: 'home' | 'menu' | 'about'): void => {
    try {
      if (!page || !['home', 'menu', 'about'].includes(page)) {
        console.error('HomePage: Invalid page provided to handleNavigate', page);
        return;
      }
      onNavigate(page);
    } catch (error) {
      console.error('HomePage: Error navigating', error);
    }
  };


  return (
    <div className="homepage">

      <div className="background-logo">
        <img src="/logos/Logo negro.PNG" alt="CACAO Background" />
      </div>


      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logos/logo-blanco.png" alt="CACAO Logo" className="header-logo" />
          </div>

          <nav className="navigation">
            <a href="#inicio" className="nav-link">INICIO</a>
            <a href="#about" className="nav-link">NOSOTROS</a>
            <button
              className="nav-link menu-button"
              onClick={() => handleNavigate('menu')}
            >
              MENU
            </button>
          </nav>

          <div className="header-actions">
            <div className="cart-icon" onClick={handleOpenCart} style={{ cursor: 'pointer', position: 'relative' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white" />
              </svg>
              {totalItems > 0 && typeof totalItems === 'number' && (
                <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </div>

            {/* 
            <div className="user-auth-section">
              {user ? (
                <UserMenu onNavigate={onNavigate} />
              ) : (
                <button className="login-btn" onClick={onOpenAuth}>
                  Acceder
                </button>
              )}
            </div>
            */}

            <button
              className="hamburger-menu"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
            >
              <span className={`hamburger - line ${isMobileMenuOpen ? 'active' : ''} `}></span>
              <span className={`hamburger - line ${isMobileMenuOpen ? 'active' : ''} `}></span>
              <span className={`hamburger - line ${isMobileMenuOpen ? 'active' : ''} `}></span>
            </button>
          </div>
        </div>
      </header>


      <div className={`mobile - menu ${isMobileMenuOpen ? 'open' : ''} `}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <img src="/logos/logo-blanco.png" alt="CACAO Logo" className="mobile-menu-logo" />
            <button
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="mobile-navigation">
            <a href="#inicio" className="mobile-nav-link" onClick={closeMobileMenu}>
              <span>INICIO</span>
            </a>
            <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>
              <span>NOSOTROS</span>
            </a>
            <button
              className="mobile-nav-link menu-button"
              onClick={() => {
                handleNavigate('menu');
                closeMobileMenu();
              }}
            >
              <span>MENU</span>
            </button>
          </nav>

          <div className="mobile-menu-actions">
            <div className="mobile-cart-icon" onClick={handleOpenCart} style={{ cursor: 'pointer', position: 'relative' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white" />
              </svg>
              {totalItems > 0 && typeof totalItems === 'number' && (
                <span className="cart-badge" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#8B4513',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span>Carrito</span>
            </div>
          </div>
        </div>
      </div>


      <main className="main-content">

        <div id="inicio" className="hero-section">
          <SimpleImageCarousel />
        </div>


        <div className="menu-highlight-section">
          <div className="menu-highlight-content">
            <h2 className="menu-highlight-title">NUESTRO MENÚ</h2>
            <p className="menu-highlight-subtitle">Descubre nuestras deliciosas opciones. Haz clic en la imagen para ver el menú completo</p>
            <div
              className="menu-image-container"
              onClick={() => handleNavigate('menu')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('menu');
                }
              }}
              aria-label="Ver menú completo"
            >
              <img
                src="/assets/images/homepage/Menu.PNG"
                alt="Menú CACAO"
                className="menu-highlight-image"
              />
              <div className="menu-image-overlay">
                <span className="menu-click-text">Haz clic para ver el menú completo</span>
              </div>
            </div>
          </div>
        </div>


        {/* Sección de Horarios */}
        <div className="horarios-section">
          <div className="horarios-content">
            <h2 className="horarios-title">Horarios de Atención</h2>
            <p className="horarios-subtitle">Visítanos en nuestros horarios de atención</p>
            <div className="horarios-image-container">
              <img
                src="/assets/images/homepage/Horarios.PNG"
                alt="Horarios de atención CACAO"
                className="horarios-image"
              />
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <AboutUs />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-left">
            <div className="owner-info">
              <h3 className="owner-name">Andrés Rodríguez</h3>
              <p className="owner-title">Fundador y Propietario</p>
              <p className="owner-description">
                Apasionado por el café y la repostería artesanal,
                Andrés creó CACAO con la visión de ofrecer experiencias
                únicas a través de sabores auténticos y un ambiente acogedor.
              </p>
            </div>
          </div>

          <div className="footer-section footer-right">
            <h3 className="footer-title">Síguenos en redes sociales</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/PasteleriaArtesanalCacao?locale=es_LA" className="social-link facebook" target="_self">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/pasteleriacacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="social-link instagram" target="_self">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>©2025 CACAO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

