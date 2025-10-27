import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselSlides, 
  CarouselSlide, 
  CarouselContent, 
  CarouselText, 
  CarouselButtons,
  CarouselArrows,
  CarouselDots
} from './carousel/Carousel';
import { Button } from './base/BaseComponents';
import AboutUs from './AboutUs';
import './HomePage.css';

const HomePage = () => {
  // Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Función para toggle del menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Función para cerrar el menú móvil
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Datos del carrusel
  const coffeeImages = [
    {
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Café Premium",
      description: "Granos seleccionados de las mejores regiones del mundo"
    },
    {
      url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Repostería Artesanal",
      description: "Postres frescos preparados diariamente con ingredientes naturales"
    },
    {
      url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Latte Art",
      description: "Arte y sabor en cada taza, preparado por nuestros baristas expertos"
    },
    {
      url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Ambiente Único",
      description: "Un espacio diseñado para que disfrutes de la mejor experiencia"
    },
    {
      url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Desayunos Especiales",
      description: "Comienza tu día con nuestros deliciosos desayunos y bebidas calientes"
    }
  ];

  return (
    <div className="homepage">
      {/* Background watermark logo */}
      <div className="background-logo">
        <img src="/Logo negro.PNG" alt="CACAO Background" />
      </div>
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/Logo blanco .PNG" alt="CACAO Logo" className="header-logo" />
          </div>
          
          <nav className="navigation">
            <a href="#inicio" className="nav-link">INICIO</a>
            <a href="#about" className="nav-link">NOSOTROS</a>
            <a href="#menu" className="nav-link">MENU</a>
          </nav>
          
          <div className="header-actions">
            <div className="cart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white"/>
              </svg>
            </div>
            <div className="profile-picture">
              <div className="profile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
                </svg>
              </div>
            </div>
            
            {/* Botón hamburguesa para móviles */}
            <button 
              className="hamburger-menu"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <img src="/Logo blanco .PNG" alt="CACAO Logo" className="mobile-menu-logo" />
            <button 
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <a href="#menu" className="mobile-nav-link" onClick={closeMobileMenu}>
              <span>MENU</span>
            </a>
          </nav>
          
          <div className="mobile-menu-actions">
            <div className="mobile-cart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S5.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white"/>
              </svg>
              <span>Carrito</span>
            </div>
            <div className="mobile-profile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
              </svg>
              <span>Perfil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Carrusel Hero Section */}
        <Carousel 
          id="inicio"
          items={coffeeImages}
          autoPlayInterval={5000}
          className="hero-carousel"
        >
          <CarouselSlides>
            {coffeeImages.map((image, index) => (
              <CarouselSlide key={index}>
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="carousel-image"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="carousel-overlay">
                  <CarouselContent>
                    <CarouselText>
                      <h1 className="carousel-title">{image.title}</h1>
                      <p className="carousel-description">{image.description}</p>
                    </CarouselText>
                    <CarouselButtons>
                      <Button variant="primary">Ver Menú</Button>
                    </CarouselButtons>
                  </CarouselContent>
                </div>
              </CarouselSlide>
            ))}
          </CarouselSlides>
          
          <CarouselArrows />
          <CarouselDots />
        </Carousel>

        {/* About Us Section */}
        <AboutUs />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Horarios de Atención</h3>
            <div className="footer-info">
              <p>Lunes a Sábado: 12:00 a 15:00 | 18:30 a 22:30</p>
              <p>Domingos: 12:00 a 16:00</p>
            </div>
          </div>
          
          <div className="footer-section footer-center">
            <div className="owner-info">
              <h3 className="owner-name">Andrés Rodríguez</h3>
              <p className="owner-title">Fundador y Propietario</p>
              <p className="owner-description">
                Apasionado por el café y la repostería artesanal, 
                Andrés creó CACAO con la visión de ofrecer experiencias 
                únicas a través de sabores auténticos y un ambiente acogedor.
              </p>
            </div>
            <div className="copyright">
              <p>©2025 CACAO. Todos los derechos reservados.</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Síguenos en redes sociales</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/PasteleriaArtesanalCacao?locale=es_LA" className="social-link facebook" target="_self">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/pasteleriacacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="social-link instagram" target="_self">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
