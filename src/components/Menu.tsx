import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { useCart } from '../hooks/useCart';
import { MenuProps, Product } from '../types';
import './Menu.css';

const Menu: React.FC<MenuProps> = ({ onNavigate, onOpenCart }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { categories, products, loading, error, getProductsByCategory } = useMenuData();
  const { addToCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Validar props
  if (!onNavigate || typeof onNavigate !== 'function') {
    console.error('Menu: onNavigate prop is required and must be a function');
    return (
      <div className="menu-container">
        <div className="error-message">
          <p>Error de configuración. Por favor, recarga la página.</p>
        </div>
      </div>
    );
  }

  const toggleDropdown = (categoryId: number): void => {
    if (typeof categoryId !== 'number' || categoryId <= 0) {
      console.error('Menu: Invalid categoryId provided to toggleDropdown');
      return;
    }
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleAddToCart = (product: Product | null | undefined): void => {
    if (!product) {
      console.error('Menu: Attempted to add invalid product to cart');
      return;
    }

    // Validar que el producto tenga las propiedades necesarias
    if (
      typeof product.id !== 'number' ||
      typeof product.price !== 'number' ||
      !product.name ||
      product.price < 0
    ) {
      console.error('Menu: Product has invalid data', product);
      return;
    }

    try {
      addToCart(product, 1);
    } catch (err) {
      console.error('Menu: Error adding product to cart', err);
    }
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
          <h1 className="menu-title">MENÚ</h1>
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
          <h1 className="menu-title">MENÚ</h1>
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
        <h1 className="menu-title">MENÚ</h1>
        <div 
          className="menu-cart-icon" 
          onClick={handleOpenCart} 
          style={{ cursor: 'pointer', position: 'relative', marginLeft: 'auto' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white"/>
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
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => {
              // Validar categoría
              if (!category || typeof category.id !== 'number' || !category.name) {
                console.warn('Menu: Invalid category found', category);
                return null;
              }

              const categoryProducts = getProductsByCategory(category.id);
              
              return (
                <div key={category.id} className="dropdown-category">
                  <button 
                    className="dropdown-trigger"
                    onClick={() => toggleDropdown(category.id)}
                    aria-expanded={activeDropdown === category.id}
                  >
                    <div className="dropdown-header">
                      <span className="category-title">{category.name || 'Categoría sin nombre'}</span>
                      <div className="three-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  </button>
                  
                  {activeDropdown === category.id && (
                    <div className="dropdown-content">
                      {Array.isArray(categoryProducts) && categoryProducts.length > 0 ? (
                        <div className="dropdown-items">
                          {categoryProducts.map((product) => {
                            // Validar producto antes de renderizar
                            if (!product || typeof product.id !== 'number' || !product.name) {
                              console.warn('Menu: Invalid product found', product);
                              return null;
                            }

                            return (
                              <div key={product.id} className="dropdown-item">
                                <div className="item-header">
                                  <h3 className="item-name">{product.name || 'Producto sin nombre'}</h3>
                                  <span className="item-price">
                                    Bs. {typeof product.price === 'number' && product.price >= 0 
                                      ? product.price.toFixed(2) 
                                      : '0.00'}
                                  </span>
                                </div>
                                {product.description && (
                                  <p className="item-description">{product.description}</p>
                                )}
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={() => handleAddToCart(product)}
                                  disabled={!product.is_available}
                                >
                                  {product.is_available ? 'Agregar al carrito' : 'No disponible'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="dropdown-items">
                          <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                            No hay productos disponibles en esta categoría
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="dropdown-menus">
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                No hay categorías disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;

