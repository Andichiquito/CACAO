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

  const getCategoryIcon = (categoryName: string): React.ReactNode => {
    const emojiStyle = { 
      fontSize: '24px', 
      marginRight: '0.5rem', 
      lineHeight: '1',
      filter: 'grayscale(100%) contrast(1.2) brightness(1.1)',
      display: 'inline-block',
      opacity: 0.9
    };
    
    switch (categoryName?.toUpperCase()) {
      case 'BEBIDAS FRÍAS':
      case 'BEBIDAS FRIAS':
        return <span style={emojiStyle}>🧊</span>; // Cubo de hielo
      case 'BEBIDAS CALIENTES':
      case 'CAFETERÍA FRÍA':
        return <span style={emojiStyle}>☕</span>; // Café
      case 'REPOSTERÍA':
      case 'REPOSTERIA':
        return <span style={emojiStyle}>🧁</span>; // Cupcake
      case 'SALADOS':
        return <span style={emojiStyle}>🥖</span>; // Baguette
      case 'BRUNCH ALL DAY':
        return <span style={emojiStyle}>🍳</span>; // Sarten con huevo
      case 'COOKIE BAR':
        return <span style={emojiStyle}>🍪</span>; // Cookie
      case 'DESAYUNOS':
        return <span style={emojiStyle}>🥞</span>; // Panqueques
      case 'INFUSIONES CALIENTES':
        return <span style={emojiStyle}>🫖</span>; // Tetera
      case 'CHOCOLATES':
        return <span style={emojiStyle}>🍫</span>; // Chocolate
      default:
        return null;
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
            <img 
              src="/images/blend-cacao.png" 
              alt="BLEND ESPECIAL CACAO" 
              className="blend-image"
            />
          </div>
        </div>

        {/* Menús desplegables */}
        <div className="dropdown-menus">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories
              .filter(category => {
                // Ocultar INFUSIONES CALIENTES y CHOCOLATES de la lista principal
                // ya que se muestran como subcategorías dentro de BEBIDAS CALIENTES
                return category.name !== 'INFUSIONES CALIENTES' && category.name !== 'CHOCOLATES';
              })
              .map((category) => {
              // Validar categoría
              if (!category || typeof category.id !== 'number' || !category.name) {
                console.warn('Menu: Invalid category found', category);
                return null;
              }

              // Para BEBIDAS CALIENTES, también incluir productos de INFUSIONES CALIENTES y CHOCOLATES
              let categoryProducts = getProductsByCategory(category.id);
              
              if (category.name === 'BEBIDAS CALIENTES') {
                // Buscar categorías relacionadas
                const infusionesCategory = categories.find(cat => 
                  cat.name === 'INFUSIONES CALIENTES' || cat.name === 'INFUSIONES CALIENTES'
                );
                const chocolatesCategory = categories.find(cat => 
                  cat.name === 'CHOCOLATES'
                );
                
                // Agregar productos de INFUSIONES CALIENTES
                if (infusionesCategory) {
                  const infusionesProducts = getProductsByCategory(infusionesCategory.id);
                  categoryProducts = [...categoryProducts, ...infusionesProducts];
                }
                
                // Agregar productos de CHOCOLATES
                if (chocolatesCategory) {
                  const chocolatesProducts = getProductsByCategory(chocolatesCategory.id);
                  categoryProducts = [...categoryProducts, ...chocolatesProducts];
                }
              }
              
              return (
                <div key={category.id} className="dropdown-category">
                  <button 
                    className="dropdown-trigger"
                    onClick={() => toggleDropdown(category.id)}
                    aria-expanded={activeDropdown === category.id}
                  >
                    <div className="dropdown-header">
                      <div className="category-title-wrapper">
                        {getCategoryIcon(category.name)}
                        <span className="category-title">{category.name || 'Categoría sin nombre'}</span>
                      </div>
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
                        category.name === 'BEBIDAS FRÍAS' || category.name === 'BEBIDAS FRIAS' ? (
                          // Vista especial para BEBIDAS FRÍAS con subsecciones
                          <div className="bebidas-frias-layout">
                            {/* Sección INFUSIONES FRÍAS */}
                            <div className="subcategory-box infusiones-frias-box">
                              <h3 className="subcategory-title">INFUSIONES FRÍAS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('ICED TEA') ||
                                     product.name.toUpperCase().includes('ICED SULTANA') ||
                                     product.name.toUpperCase().includes('JAMAICA'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección LICUADOS */}
                            <div className="subcategory-box licuados-box">
                              <h3 className="subcategory-title">LICUADOS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('LICUADO')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección REFRESCANTES */}
                            <div className="subcategory-box refrescantes-box">
                              <h3 className="subcategory-title">REFRESCANTES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('AGUA') ||
                                     product.name.toUpperCase().includes('COCA COLA') ||
                                     product.name.toUpperCase().includes('COCA-COLA'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección FRAPPÉS */}
                            <div className="subcategory-box frappes-box">
                              <h3 className="subcategory-title">FRAPPÉS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('FRAPUCCINO') ||
                                     product.name.toUpperCase().includes('FRAPPÉ') ||
                                     product.name.toUpperCase().includes('FRAPPE'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección SMOOTHIES */}
                            <div className="subcategory-box smoothies-box">
                              <h3 className="subcategory-title">SMOOTHIES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('FRUTOS DEL BOSQUE') ||
                                     product.name.toUpperCase().includes('CITRUS') ||
                                     product.name.toUpperCase().includes('SMOOTHIE'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección SODAS FRÍAS */}
                            <div className="subcategory-box sodas-frias-box">
                              <h3 className="subcategory-title">SODAS FRÍAS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('SODA')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'CAFETERÍA FRÍA' || category.name === 'CAFETERIA FRIA' ? (
                          // Vista especial para CAFETERÍA FRÍA con subsecciones
                          <div className="cafeteria-fria-layout">
                            {/* Sección BEBIDAS CON LECHE */}
                            <div className="subcategory-box con-leche-box">
                              <h3 className="subcategory-title">CON LECHE</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('FRAPPUCCINO') ||
                                     product.name.toUpperCase().includes('ICED LATTE') ||
                                     product.name.toUpperCase().includes('AFFOGATO'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección ESPRESSO FRÍO */}
                            <div className="subcategory-box espresso-frio-box">
                              <h3 className="subcategory-title">ESPRESSO FRÍO</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('ICED AMERICANO') ||
                                     product.name.toUpperCase().includes('ESPRESSO') ||
                                     product.name.toUpperCase().includes('AEROCANO') ||
                                     product.name.toUpperCase().includes('ORANGE COFFEE'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'BEBIDAS CALIENTES' ? (
                          // Vista especial para BEBIDAS CALIENTES con subsecciones
                          <div className="bebidas-calientes-layout">
                            {/* Sección CAFÉS */}
                            <div className="subcategory-box cafes-box">
                              <h3 className="subcategory-title">CAFÉS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    !product.name.toUpperCase().includes('TÉ') &&
                                    !product.name.toUpperCase().includes('SULTANA') &&
                                    !product.name.toUpperCase().includes('COCA') &&
                                    !product.name.toUpperCase().includes('MANZANILLA') &&
                                    !product.name.toUpperCase().includes('ANIS') &&
                                    !product.name.toUpperCase().includes('CHOCOLATE') &&
                                    !product.name.toUpperCase().includes('SUBMARINO')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección INFUSIONES CALIENTES */}
                            <div className="subcategory-box infusiones-calientes-box">
                              <h3 className="subcategory-title">INFUSIONES CALIENTES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('TÉ') ||
                                     product.name.toUpperCase().includes('SULTANA') ||
                                     product.name.toUpperCase().includes('COCA') ||
                                     product.name.toUpperCase().includes('MANZANILLA') ||
                                     product.name.toUpperCase().includes('ANIS'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección CHOCOLATES */}
                            <div className="subcategory-box chocolates-box">
                              <h3 className="subcategory-title">CHOCOLATES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('CHOCOLATE') ||
                                     product.name.toUpperCase().includes('SUBMARINO'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'BRUNCH ALL DAY' ? (
                          // Vista especial para BRUNCH ALL DAY con subsecciones
                          <div className="brunch-layout">
                            {/* Sección WAFFLES */}
                            <div className="subcategory-box waffles-box">
                              <h3 className="subcategory-title">WAFFLES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('WAFFLE') ||
                                     (product.name.toUpperCase() === 'AMERICANO' && 
                                      !product.name.toUpperCase().includes('SOBRE PAN') &&
                                      !product.name.toUpperCase().includes('ENTRE PAN')) ||
                                     (product.name.toUpperCase() === 'PALTOS' &&
                                      !product.name.toUpperCase().includes('SOBRE PAN'))
                                  ))
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección SOBRE PAN */}
                            <div className="subcategory-box sobre-pan-box">
                              <h3 className="subcategory-title">SOBRE PAN</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('SOBRE PAN')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección ENTRE PAN */}
                            <div className="subcategory-box entre-pan-box">
                              <h3 className="subcategory-title">ENTRE PAN</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('ENTRE PAN') ||
                                     (product.name.toUpperCase() === 'STEAK' && 
                                      !product.name.toUpperCase().includes('SOBRE PAN')) ||
                                     (product.name.toUpperCase() === 'PERNIL' && 
                                      !product.name.toUpperCase().includes('SOBRE PAN')) ||
                                     product.name.toUpperCase() === 'HONEY MUSTARD CHICKEN' ||
                                     product.name.toUpperCase() === 'EL PHILI')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'DESAYUNOS' ? (
                          // Vista especial para DESAYUNOS con subsecciones
                          <div className="desayunos-layout">
                            {/* Sección DESAYUNO */}
                            <div className="subcategory-box">
                              <h3 className="subcategory-title">DESAYUNO</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().startsWith('DESAYUNO')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección EXTRAS */}
                            <div className="subcategory-box extras-box">
                              <h3 className="subcategory-title">EXTRAS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().startsWith('PORCIÓN') ||
                                     product.name.toUpperCase().startsWith('TOSTADAS') ||
                                     product.name.toUpperCase().startsWith('CREMA BATIDA'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección ZUMOS */}
                            <div className="subcategory-box zumos-box">
                              <h3 className="subcategory-title">ZUMOS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('ZUMO')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'SALADOS' ? (
                          // Vista especial para SALADOS con subsecciones
                          <div className="salados-layout">
                            {/* Sección SANDWICHES */}
                            <div className="subcategory-box sandwiches-box">
                              <h3 className="subcategory-title">SANDWICHES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('POLLO AL PESTO') ||
                                     product.name.toUpperCase().includes('NAPOLITANO') ||
                                     product.name.toUpperCase().includes('CAPRESE') ||
                                     product.name.toUpperCase().includes('MIXTO'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección PANINIS */}
                            <div className="subcategory-box paninis-box">
                              <h3 className="subcategory-title">PANINIS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('PANINI')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección CUÑAPES */}
                            <div className="subcategory-box cunapes-box">
                              <h3 className="subcategory-title">CUÑAPES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('CUÑAPE')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección BAGELS */}
                            <div className="subcategory-box bagels-box">
                              <h3 className="subcategory-title">BAGELS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('BAGEL')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'COOKIE BAR' ? (
                          // Vista especial para COOKIE BAR con subsecciones
                          <div className="cookie-bar-layout">
                            {/* Sección PAQUETES */}
                            <div className="subcategory-box paquetes-box">
                              <h3 className="subcategory-title">PAQUETES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    product.name.toUpperCase().includes('PAQUETE')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección SUELTAS */}
                            <div className="subcategory-box sueltas-box">
                              <h3 className="subcategory-title">SUELTAS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    !product.name.toUpperCase().includes('PAQUETE')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : category.name === 'REPOSTERÍA' ? (
                          // Vista especial para REPOSTERÍA con subsecciones
                          <div className="reposteria-layout">
                            {/* Sección TORTAS */}
                            <div className="subcategory-box tortas-box">
                              <h3 className="subcategory-title">TORTAS</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    (product.name.toUpperCase().includes('TORTA') ||
                                     product.name.toUpperCase().includes('TRES LECHES'))
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>

                            {/* Sección POSTRES */}
                            <div className="subcategory-box postres-box">
                              <h3 className="subcategory-title">POSTRES</h3>
                              <div className="subcategory-items">
                                {categoryProducts
                                  .filter(product => 
                                    product.name && 
                                    !product.name.toUpperCase().includes('TORTA') &&
                                    !product.name.toUpperCase().includes('TRES LECHES')
                                  )
                                  .map((product) => (
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
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Vista normal para otras categorías
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
                        )
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

