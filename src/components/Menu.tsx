import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { useCart } from '../hooks/useCart';
import { MenuProps } from '../types';
import './Menu.css';

const Menu: React.FC<MenuProps> = ({ onNavigate, onOpenCart }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { categories, products, loading, error, getProductsByCategory } = useMenuData();
  const { addToCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const toggleDropdown = (categoryId: number): void => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleAddToCart = (product: any): void => {
    addToCart(product, 1);
    // Opcional: abrir el carrito después de agregar un producto
    // if (onOpenCart) {
    //   onOpenCart();
    // }
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

  const handleOpenCart = (): void => {
    if (onOpenCart) {
      onOpenCart();
    }
  };

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
        <div 
          className="menu-cart-icon" 
          onClick={handleOpenCart} 
          style={{ cursor: 'pointer', position: 'relative', marginLeft: 'auto' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white"/>
          </svg>
          {totalItems > 0 && (
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
              {totalItems}
            </span>
          )}
        </div>
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

