import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { useCart } from '../hooks/useCart';
import { MenuProps } from '../types';
import './Menu.css';

const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { categories, products, loading, error, getProductsByCategory } = useMenuData();
  const { addToCart } = useCart();

  const toggleDropdown = (categoryId: number): void => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleAddToCart = (product: any): void => {
    addToCart(product, 1);
    // Aquí podrías agregar una notificación de éxito
    console.log(`Agregado al carrito: ${product.name}`);
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="menu-header">
          <button 
            className="back-button"
            onClick={() => onNavigate('home')}
            aria-label="Volver al inicio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="menu-title">CAFETERÍA</h1>
        </div>
        <div className="loading-message">
          <p>Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="menu-header">
          <button 
            className="back-button"
            onClick={() => onNavigate('home')}
            aria-label="Volver al inicio"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="menu-title">CAFETERÍA</h1>
        </div>
        <div className="error-message">
          <p>Error al cargar el menú: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
          aria-label="Volver al inicio"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="menu-title">CAFETERÍA</h1>
      </div>
      
      <div className="menu-content">
        {/* Sección especial del blend */}
        <div className="special-blend-section">
          <div className="blend-box">
            <h2 className="blend-title">BLEND ESPECIAL CACAO</h2>
            <p className="blend-subtitle">La esencia de nuestra pasión</p>
            <div className="blend-details">
              <p><strong>Origen:</strong> Caranavi, Bolivia</p>
              <p><strong>Altura:</strong> 1.600 - 1.800 msnm</p>
              <p><strong>Variedad:</strong> Typica, Caturra</p>
              <p><strong>Notas:</strong> Chocolate, Caramelo, Frutos Rojos</p>
            </div>
            <p className="blend-description">
              Nuestro blend exclusivo, cuidadosamente seleccionado y tostado para ofrecer una experiencia única en cada taza.
              Un equilibrio perfecto entre dulzura y acidez, con un cuerpo sedoso y un final persistente.
            </p>
          </div>
        </div>

        {/* Menús desplegables */}
        <div className="dropdown-menus">
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);
            return (
              <div key={category.id} className="dropdown-category">
                <button 
                  className="dropdown-trigger"
                  onClick={() => toggleDropdown(category.id)}
                  aria-expanded={activeDropdown === category.id}
                >
                  <div className="dropdown-header">
                    <span className="category-title">{category.name}</span>
                    <div className="three-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                </button>
                
                {activeDropdown === category.id && (
                  <div className="dropdown-content">
                    <div className="dropdown-items">
                      {categoryProducts.map((product) => (
                        <div key={product.id} className="dropdown-item">
                          <div className="item-header">
                            <h3 className="item-name">{product.name}</h3>
                            <span className="item-price">Bs. {product.price}</span>
                          </div>
                          <p className="item-description">{product.description}</p>
                          <button 
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            Agregar al carrito
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;

