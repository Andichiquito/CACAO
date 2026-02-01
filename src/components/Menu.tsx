import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { useCart } from '../hooks/useCart';
import { useSupabase } from '../contexts/SupabaseContext';
import UserMenu from './UserMenu';
import { MenuProps, Product } from '../types';
import './Menu.css';

const Menu: React.FC<MenuProps> = ({ onNavigate, onOpenCart, onOpenAuth }) => {
  const { user } = useSupabase();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, loading, error, getProductsByCategory } = useMenuData();
  const { addToCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();


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


  const filterProducts = (products: Product[]): Product[] => {
    if (!searchTerm) return products;
    const lowerTerm = searchTerm.toLowerCase().trim();
    return products.filter(product =>
      (product.name && product.name.toLowerCase().includes(lowerTerm)) ||
      (product.description && product.description.toLowerCase().includes(lowerTerm))
    );
  };


  const getBaseName = (productName: string): string => {
    if (!productName) return '';

    const name = productName.toUpperCase().trim();




    const baseKeywords = [
      'FRAPUCCINO SABORIZADO', 'FRAPPUCCINO SABORIZADO',
      'TRES LECHES',
      'COOKIE', 'FRAPUCCINO', 'FRAPPÉ', 'FRAPPE', 'LICUADO',
      'SMOOTHIE', 'CAFÉ', 'CHOCOLATE', 'TORTA', 'POSTRE',
      'SANDWICH', 'PANINI', 'BAGEL', 'WAFFLE', 'SODA', 'AGUA'
    ];


    for (const keyword of baseKeywords) {
      if (name.startsWith(keyword + ' ') || name === keyword) {
        return keyword;
      }
    }


    const firstWord = name.split(' ')[0];
    return firstWord || name;
  };


  const groupProductsByBaseName = (products: Product[]): Map<string, Product[]> => {
    const grouped = new Map<string, Product[]>();

    products.forEach(product => {
      if (!product.name) return;

      const baseName = getBaseName(product.name);

      if (!grouped.has(baseName)) {
        grouped.set(baseName, []);
      }

      const existingProducts = grouped.get(baseName);
      if (existingProducts) {
        existingProducts.push(product);
      }
    });

    return grouped;
  };





  const getProductSelectors = (product: Product): Array<{ label: string; options: string[] }> => {
    const name = product.name ? product.name.toUpperCase().trim() : '';

    if (name === 'LICUADO') {
      return [
        {
          label: 'Base',
          options: ['Con agua', 'Con leche']
        },
        {
          label: 'Sabor',
          options: [
            'Piña con papaya',
            'Frutos del bosque',
            'Copoazú con durazno',
            'Limonada de frutilla',
            'Piña hierba buena',
            'Frutilla hierba buena',
            'Mango maracuyá'
          ]
        }
      ];
    }

    if (name === 'FRAPPUCCINO SABORIZADO') {
      return [
        {
          label: 'Sabor',
          options: [
            'Brownie',
            'Cookie',
            'Dulce de leche',
            'Frutilla',
            'Chocolate',
            'Oreo',
            'Cookie red velvet',
            'Chocomenta'
          ]
        }
      ];
    }

    if (name === 'TRES LECHES CLÁSICOS' || name === 'TRES LECHES CLASICOS') {
      return [
        {
          label: 'Sabor',
          options: [
            'Chocolate',
            'Red velvet'
          ]
        }
      ];
    }

    if (name === 'TRES LECHES PREMIUM') {
      return [
        {
          label: 'Sabor',
          options: [
            'Chocomaracuya',
            'Pie de limón',
            'Café con dulce de leche'
          ]
        }
      ];
    }

    if (product.description && product.description.includes('|')) {
      const parts = product.description.split('|').map(p => p.trim());
      return parts.map(part => {
        const [label, optionsStr] = part.split(':').map(s => s.trim());
        const options = optionsStr ? optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0) : [];
        return { label: label || 'Opción', options };
      }).filter(s => s.options.length > 0);
    }

    return [];
  };

  const renderProductItem = (
    product: Product,
    isGrouped: boolean = false,
    groupKey?: string
  ): React.ReactElement => {
    const productKey = isGrouped && groupKey ? `group-${groupKey}-${product.id}` : product.id;

    const selectors = getProductSelectors(product);



    const getSelectionKey = (index: number) => `selector-${product.id}-${index}`;
    const flavorKey = `flavor-${product.id}`;


    const handleSelectorChange = (selectorIndex: number, optionIndex: number) => {
      setSelectedVariants(prev => ({
        ...prev,
        [getSelectionKey(selectorIndex)]: optionIndex
      }));
    };

    const handleFlavorChange = (index: number) => {
      setSelectedVariants(prev => ({
        ...prev,
        [flavorKey]: index
      }));
    };


    const getSelectedOptions = () => {
      if (selectors.length > 0) {
        return selectors.map((selector, index) => {
          const selectedIndex = selectedVariants[getSelectionKey(index)] || 0;
          return selector.options[selectedIndex] || selector.options[0];
        });
      }
      return [];
    };

    return (
      <div key={productKey} className="dropdown-item">
        <div className="item-header">
          <h3 className="item-name">{product.name || 'Producto sin nombre'}</h3>
          <span className="item-price">
            Bs. {typeof product.price === 'number' && product.price >= 0
              ? product.price.toFixed(2)
              : '0.00'}
          </span>
        </div>


        {selectors.length > 0 ? (
          <div className="multi-selector-container">
            {selectors.map((selector, selectorIndex) => {
              const selectedIndex = selectedVariants[getSelectionKey(selectorIndex)] || 0;
              return (
                <div key={selectorIndex} className="variant-selector">
                  <label className="variant-label" htmlFor={`${productKey}-selector-${selectorIndex}`}>
                    {selector.label}:
                  </label>
                  <select
                    id={`${productKey}-selector-${selectorIndex}`}
                    className="variant-select"
                    value={selectedIndex}
                    onChange={(e) => handleSelectorChange(selectorIndex, Number(e.target.value))}
                  >
                    {selector.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        ) : (

          product.description && (
            <p className="item-description">{product.description}</p>
          )
        )}

        <button
          className="add-to-cart-btn"
          onClick={() => {
            const selectedOptions = getSelectedOptions();
            if (selectedOptions.length > 0) {
              const optionsText = selectedOptions.join(' - ');
              const productWithOptions = {
                ...product,
                name: `${product.name} - ${optionsText}`,
                description: optionsText
              };
              handleAddToCart(productWithOptions);
            } else {
              handleAddToCart(product);
            }
          }}
          disabled={!product.is_available}
        >
          {product.is_available ? 'Agregar al carrito' : 'No disponible'}
        </button>
      </div>
    );
  };


  const renderGroupedProducts = (
    products: Product[],
    groupKey: string
  ): React.ReactElement => {

    if (products.length === 1) {
      return renderProductItem(products[0]);
    }


    const groupId = `group-${groupKey}`;
    const baseName = getBaseName(products[0].name);


    const selectedIndex = selectedVariants[groupId] || 0;
    const selectedProduct = products[selectedIndex] || products[0];


    const handleVariantChange = (newIndex: number) => {
      setSelectedVariants(prev => ({
        ...prev,
        [groupId]: newIndex
      }));
    };

    const subSelectors = getProductSelectors(selectedProduct);

    const getSelectedOptions = () => {
      if (subSelectors.length > 0) {
        return subSelectors.map((selector, index) => {
          const getSelectionKey = (idx: number) => `selector-${selectedProduct.id}-${idx}`;
          const selectedIdx = selectedVariants[getSelectionKey(index)] || 0;
          return selector.options[selectedIdx] || selector.options[0];
        });
      }
      return [];
    };

    return (
      <div key={groupId} className="dropdown-item grouped-product">
        <div className="item-header">
          <h3 className="item-name">{baseName}</h3>
          <span className="item-price">
            Bs. {typeof selectedProduct.price === 'number' && selectedProduct.price >= 0
              ? selectedProduct.price.toFixed(2)
              : '0.00'}
          </span>
        </div>


        <div className="variant-selector">
          <label className="variant-label" htmlFor={`variant-${groupId}`}>
            Elige tu sabor:
          </label>
          <select
            id={`variant-${groupId}`}
            className="variant-select"
            value={selectedIndex}
            onChange={(e) => handleVariantChange(Number(e.target.value))}
          >
            {products.map((product, index) => {
              const variantName = product.name.replace(new RegExp(`^${baseName}\\s*`, 'i'), '').trim();
              return (
                <option key={product.id} value={index}>
                  {variantName || product.name}
                </option>
              );
            })}
          </select>
        </div>


        {subSelectors.length > 0 && (
          <div className="multi-selector-container">
            {subSelectors.map((selector, selectorIndex) => {
              const getSelectionKey = (idx: number) => `selector-${selectedProduct.id}-${idx}`;
              const selectedIdx = selectedVariants[getSelectionKey(selectorIndex)] || 0;

              return (
                <div key={selectorIndex} className="variant-selector">
                  <label className="variant-label" htmlFor={`group-${groupId}-selector-${selectorIndex}`}>
                    {selector.label}:
                  </label>
                  <select
                    id={`group-${groupId}-selector-${selectorIndex}`}
                    className="variant-select"
                    value={selectedIdx}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedVariants(prev => ({
                        ...prev,
                        [getSelectionKey(selectorIndex)]: val
                      }));
                    }}
                  >
                    {selector.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}


        {selectedProduct.description && (
          <p className="item-description" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {selectedProduct.description}
          </p>
        )}

        <button
          className="add-to-cart-btn"
          onClick={() => {
            const selectedOptions = getSelectedOptions();
            if (selectedOptions.length > 0) {
              const optionsText = selectedOptions.join(' - ');
              const productWithOptions = {
                ...selectedProduct,
                name: `${selectedProduct.name} - ${optionsText}`,
                description: optionsText
              };
              handleAddToCart(productWithOptions);
            } else {
              handleAddToCart(selectedProduct);
            }
          }}
          disabled={!selectedProduct.is_available}
        >
          {selectedProduct.is_available ? 'Agregar al carrito' : 'No disponible'}
        </button>
      </div>
    );
  };


  const renderProductsWithGrouping = (products: Product[]): React.ReactElement[] => {
    const validProducts = products.filter(
      product => product && typeof product.id === 'number' && product.name
    );

    if (validProducts.length === 0) {
      return [];
    }

    const groupedProducts = groupProductsByBaseName(validProducts);
    const renderedItems: React.ReactElement[] = [];

    groupedProducts.forEach((groupProducts, baseName) => {
      if (groupProducts.length > 1) {

        renderedItems.push(renderGroupedProducts(groupProducts, baseName));
      } else {

        renderedItems.push(renderProductItem(groupProducts[0]));
      }
    });

    return renderedItems;
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
              <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="menu-title">MENÚ</h1>
        </div>
        <div className="loading-message">
          <img src="/logos/logo-blanco.png" alt="Cargando..." className="loading-logo" />
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
              <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      case 'TORTAS ENTERAS':
        return <span style={emojiStyle}>🎂</span>; // Torta entera
      case 'BEBIDAS DE AUTOR':
        return <span style={emojiStyle}>✨</span>; // Destellos
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
            <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="menu-title">MENÚ</h1>

        <div className="menu-header-actions">
          <div
            className="menu-cart-icon"
            onClick={handleOpenCart}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white" />
            </svg>
            {totalItems > 0 && typeof totalItems === 'number' && (
              <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </div>

          {/* 
          <div className="menu-auth-section">
            {user ? (
              <UserMenu onNavigate={onNavigate} />
            ) : (
              <button className="menu-login-btn" onClick={onOpenAuth}>
                Acceder
              </button>
            )}
          </div>
          */}
        </div>
      </div>

      <div className="menu-content">

        <div className="special-blend-section">
          <div className="blend-box">
            <img
              src="/images/blend-cacao.png"
              alt="BLEND ESPECIAL CACAO"
              className="blend-image"
            />
          </div>
        </div>


        <div className="search-container" style={{ marginBottom: '2rem', width: '100%', maxWidth: '600px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white" fillOpacity="0.7" />
          </svg>
        </div>


        <div className="dropdown-menus">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories
              .sort((a, b) => {
                const order = [
                  'BEBIDAS DE AUTOR',
                  'BEBIDAS CALIENTES',
                  'CAFETERÍA FRÍA', 'CAFETERIA FRIA',
                  'BEBIDAS FRÍAS', 'BEBIDAS FRIAS',
                  'BRUNCH ALL DAY',
                  'TORTAS ENTERAS'
                ];
                const indexA = order.indexOf(a.name.toUpperCase());
                const indexB = order.indexOf(b.name.toUpperCase());


                if (indexA !== -1 && indexB !== -1) return indexA - indexB;

                if (indexA !== -1) return -1;

                if (indexB !== -1) return 1;

                return 0;
              })
              .map((category) => {

                if (!category || typeof category.id !== 'number' || !category.name) {
                  console.warn('Menu: Invalid category found', category);
                  return null;
                }


                let categoryProducts = getProductsByCategory(category.id);

                if (category.name === 'BEBIDAS CALIENTES') {

                  const infusionesCategory = categories.find(cat =>
                    cat.name === 'INFUSIONES CALIENTES' || cat.name === 'INFUSIONES CALIENTES'
                  );
                  const chocolatesCategory = categories.find(cat =>
                    cat.name === 'CHOCOLATES'
                  );


                  if (infusionesCategory) {
                    const infusionesProducts = getProductsByCategory(infusionesCategory.id);
                    categoryProducts = [...categoryProducts, ...infusionesProducts];
                  }


                  if (chocolatesCategory) {
                    const chocolatesProducts = getProductsByCategory(chocolatesCategory.id);
                    categoryProducts = [...categoryProducts, ...chocolatesProducts];
                  }
                }


                const filteredProducts = filterProducts(categoryProducts);


                if (searchTerm && filteredProducts.length === 0) {
                  return null;
                }



                const isExpanded = searchTerm ? true : activeDropdown === category.id;


                categoryProducts = filteredProducts;

                return (
                  <div key={category.id} className="dropdown-category">
                    <button
                      className="dropdown-trigger"
                      onClick={() => toggleDropdown(category.id)}
                      aria-expanded={isExpanded}
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

                    {isExpanded && (
                      <div className="dropdown-content">
                        {Array.isArray(categoryProducts) && categoryProducts.length > 0 ? (
                          category.name === 'BEBIDAS FRÍAS' || category.name === 'BEBIDAS FRIAS' ? (

                            <div className="bebidas-frias-layout">

                              <div className="subcategory-box infusiones-frias-box">
                                <h3 className="subcategory-title">INFUSIONES FRÍAS</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('ICED TEA') ||
                                        product.name.toUpperCase().includes('ICED SULTANA')) &&
                                      !product.name.toUpperCase().includes('LATTE') &&
                                      !product.name.toUpperCase().includes('ESPRESSO') &&
                                      !product.name.toUpperCase().includes('AMERICANO')
                                    )
                                  )}
                                </div>
                              </div>


                              <div className="subcategory-box frappes-box">
                                <h3 className="subcategory-title">FRAPPÉS</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('FRAPPUCCINO') ||
                                        product.name.toUpperCase().includes('FRAPPÉ') ||
                                        product.name.toUpperCase().includes('FRAPPE'))
                                    )
                                  )}
                                </div>
                              </div>


                              <div className="subcategory-box licuados-box">
                                <h3 className="subcategory-title">LICUADOS</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      product.name.toUpperCase().includes('LICUADO')
                                    )
                                  )}
                                </div>
                              </div>


                              <div className="subcategory-box smoothies-box">
                                <h3 className="subcategory-title">SMOOTHIES</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('FRUTOS DEL BOSQUE') ||
                                        product.name.toUpperCase().includes('CITRUS') ||
                                        product.name.toUpperCase().includes('SMOOTHIE'))
                                    )
                                  )}
                                </div>
                              </div>


                              <div className="subcategory-box refrescantes-box">
                                <h3 className="subcategory-title">REFRESCANTES</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('AGUA') ||
                                        product.name.toUpperCase().includes('COCA COLA') ||
                                        product.name.toUpperCase().includes('COCA-COLA')) &&
                                      !product.name.toUpperCase().includes('LICUADO')
                                    )
                                  )}
                                </div>
                              </div>


                              <div className="subcategory-box sodas-box">
                                <h3 className="subcategory-title">SODAS FRIAS</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('SODA'))
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : category.name === 'CAFETERÍA FRÍA' || category.name === 'CAFETERIA FRIA' ? (

                            <div className="cafeteria-fria-layout">

                              <div className="subcategory-box cafeteria-left-box">
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('FRAPPUCCINO') ||
                                        product.name.toUpperCase().includes('ICED AMERICANO') ||
                                        product.name.toUpperCase().includes('ICED LATTE') ||
                                        product.name.toUpperCase().includes('ICED MOCHA') ||
                                        product.name.toUpperCase().includes('ICED SULTANA') ||
                                        product.name.toUpperCase().includes('AFFOGATO')) &&
                                      !product.name.toUpperCase().includes('FRAPUCCINO') // Excluir una P (Bebidas Frías)
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Columna Derecha: Refrescantes/Tónicos */}
                              <div className="subcategory-box cafeteria-right-box">
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('CITRUS') ||
                                        product.name.toUpperCase().includes('AEROCANO') ||
                                        product.name.toUpperCase().includes('PASSION') ||
                                        product.name.toUpperCase().includes('TONIC') ||
                                        product.name.toUpperCase().includes('ORANGE COFFEE'))
                                    )
                                  )}
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
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      !product.name.toUpperCase().includes('TÉ') &&
                                      !product.name.toUpperCase().includes('SULTANA') &&
                                      !product.name.toUpperCase().includes('COCA') &&
                                      !product.name.toUpperCase().includes('MANZANILLA') &&
                                      !product.name.toUpperCase().includes('ANIS') &&
                                      !product.name.toUpperCase().includes('CHOCOLATE') &&
                                      !product.name.toUpperCase().includes('SUBMARINO')
                                    )
                                  )}
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
                              {/* Columna Izquierda: WAFFLES y SOBRE PAN */}
                              <div className="brunch-left-column">
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
                                            !product.name.toUpperCase().includes('ENTRE PAN') &&
                                            !product.name.toUpperCase().includes('ICED')) ||
                                          (product.name.toUpperCase() === 'PALTOS'))
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

                                {/* Sección SOBRE PAN */}
                                <div className="subcategory-box sobre-pan-box" style={{ marginTop: '1.5rem' }}>
                                  <h3 className="subcategory-title">SOBRE PAN</h3>
                                  <div className="subcategory-items">
                                    {categoryProducts
                                      .filter(product =>
                                        product.name &&
                                        (product.name.toUpperCase().includes('SOBRE PAN') ||
                                          product.name.toUpperCase() === 'AVOCADO' ||
                                          product.name.toUpperCase() === 'CRIOLLO' ||
                                          (product.name.toUpperCase() === 'AMERICANO' &&
                                            product.name.toUpperCase().includes('SOBRE PAN'))) // Ajustar lógica si es necesario
                                      )
                                      // Nota: La lógica de filtrado actual para 'SOBRE PAN' parece depender de que el nombre incluya 'SOBRE PAN'
                                      // Si los productos se llaman solo 'AVOCADO', 'CRIOLLO', necesitamos asegurarnos de que se capturen aquí.
                                      // Asumiré que los nombres en la base de datos pueden no tener 'SOBRE PAN' explícito si son únicos,
                                      // pero el código anterior usaba .includes('SOBRE PAN').
                                      // Voy a ampliar el filtro para incluir los nombres específicos de la imagen.
                                      .filter(product =>
                                        product.name &&
                                        (product.name.toUpperCase().includes('SOBRE PAN') ||
                                          product.name.toUpperCase() === 'AVOCADO' ||
                                          product.name.toUpperCase() === 'CRIOLLO' ||
                                          (product.name.toUpperCase() === 'AMERICANO' && !product.name.toUpperCase().includes('WAFFLE') && !product.name.toUpperCase().includes('ICED')))
                                      )
                                      // Filtrar duplicados si 'AMERICANO' aparece en ambos
                                      // Mejor estrategia: Usar IDs o nombres muy específicos si es posible.
                                      // Por ahora, confiar en el filtro.
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

                              {/* Columna Derecha: ENTRE PAN */}
                              <div className="brunch-right-column">
                                <div className="subcategory-box entre-pan-box">
                                  <h3 className="subcategory-title">ENTRE PAN</h3>
                                  <div className="subcategory-items">
                                    {categoryProducts
                                      .filter(product =>
                                        product.name &&
                                        (product.name.toUpperCase().includes('ENTRE PAN') ||
                                          product.name.toUpperCase() === 'STEAK' ||
                                          product.name.toUpperCase() === 'PERNIL' ||
                                          product.name.toUpperCase().includes('HONEY MUSTARD') ||
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
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      product.name.toUpperCase().includes('PAQUETE')
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Sección SUELTAS */}
                              <div className="subcategory-box sueltas-box">
                                <h3 className="subcategory-title">SUELTAS</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      !product.name.toUpperCase().includes('PAQUETE')
                                    )
                                  )}
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
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      (product.name.toUpperCase().includes('TORTA') ||
                                        product.name.toUpperCase().includes('TRES LECHES'))
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Sección POSTRES */}
                              <div className="subcategory-box postres-box">
                                <h3 className="subcategory-title">POSTRES</h3>
                                <div className="subcategory-items">
                                  {renderProductsWithGrouping(
                                    categoryProducts.filter(product =>
                                      product.name &&
                                      !product.name.toUpperCase().includes('TORTA') &&
                                      !product.name.toUpperCase().includes('TRES LECHES')
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Vista normal para otras categorías
                            <div className="dropdown-items">
                              {(() => {
                                // Filtrar productos válidos
                                const validProducts = categoryProducts.filter(
                                  product => product && typeof product.id === 'number' && product.name
                                );

                                // Agrupar productos por nombre base
                                const groupedProducts = groupProductsByBaseName(validProducts);

                                // Renderizar productos agrupados
                                const renderedItems: React.ReactElement[] = [];

                                groupedProducts.forEach((products, baseName) => {
                                  if (products.length > 1) {
                                    // Múltiples productos con el mismo nombre base
                                    renderedItems.push(renderGroupedProducts(products, baseName));
                                  } else {
                                    // Producto único
                                    renderedItems.push(renderProductItem(products[0]));
                                  }
                                });

                                return renderedItems.length > 0 ? renderedItems : (
                                  <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                                    No hay productos disponibles
                                  </p>
                                );
                              })()}
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

