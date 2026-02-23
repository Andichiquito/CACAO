import React, { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { useCart } from '../hooks/useCart';
import { MenuProps, Product, Category } from '../types';
import './Menu.css';

const Menu: React.FC<MenuProps> = ({ onNavigate, onOpenCart }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, loading, error, getProductsByCategory } = useMenuData();
  const { addToCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (!onNavigate || typeof onNavigate !== 'function') {
    return (
      <div className="menu-container">
        <div className="error-message">
          <p>Error de configuración. Por favor, recarga la página.</p>
        </div>
      </div>
    );
  }

  const toggleDropdown = (categoryId: number): void => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const handleAddToCart = (product: Product | null | undefined): void => {
    if (!product) return;
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
      (product.description && product.description.toLowerCase().includes(lowerTerm)) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(lowerTerm))
    );
  };

  const getBaseName = (productName: string): string => {
    if (!productName) return '';
    const name = productName.toUpperCase().trim();

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
      grouped.get(baseName)?.push(product);
    });
    return grouped;
  };

  const getProductSelectors = (product: Product): Array<{ label: string; options: string[]; showForIndices?: number[] }> => {
    if (!product.description) return [];

    const isDependent = product.description.startsWith('@DEPENDENT@');
    const descContent = isDependent ? product.description.replace('@DEPENDENT@', '').trim() : product.description;

    const parts = descContent.includes('|')
      ? descContent.split('|')
      : [descContent];

    return parts
      .map(p => p.trim())
      .filter(p => p.includes(':')) // Solo procesar partes que parecen selectores
      .map(part => {
        // Check for [indices] pattern like "Sabor[0,1]:" or "Sabor[2]:"
        const indexMatch = part.match(/^([^[]+)\[([0-9,]+)\]:\s*(.+)$/);
        if (indexMatch) {
          const label = indexMatch[1].trim();
          const indices = indexMatch[2].split(',').map(i => parseInt(i.trim()));
          const optionsStr = indexMatch[3];
          const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);
          return { label: label || 'Opción', options, showForIndices: indices };
        }

        const [label, optionsStr] = part.split(':').map(s => s.trim());
        const options = optionsStr ? optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0) : [];
        return { label: label || 'Opción', options };
      })
      .filter(s => s.options.length > 0);
  };

  const renderProductItem = (product: Product, isGrouped: boolean = false, groupKey?: string): React.ReactElement => {
    const productKey = isGrouped && groupKey ? `group-${groupKey}-${product.id}` : product.id.toString();
    const selectors = getProductSelectors(product);
    const getSelectionKey = (index: number) => `selector-${product.id}-${index}`;

    const handleSelectorChange = (selectorIndex: number, optionIndex: number) => {
      setSelectedVariants(prev => ({ ...prev, [getSelectionKey(selectorIndex)]: optionIndex }));
    };

    const getSelectedOptions = () => {
      return selectors.map((selector, index) => {
        const selectedIndex = selectedVariants[getSelectionKey(index)] || 0;
        return selector.options[selectedIndex] || selector.options[0];
      });
    };

    return (
      <div key={productKey} className={`product-card ${isGrouped ? 'is-grouped' : ''}`}>
        {!isGrouped && (
          <div className="item-header">
            <h3 className="item-name">{product.name}</h3>
            <span className="item-price">Bs. {product.price.toFixed(2)}</span>
          </div>
        )}

        {selectors.length > 0 ? (
          <div className="multi-selector-container">
            {selectors.map((selector, index) => {
              // Get the first selector's selected index to filter dependent selectors
              const firstSelectorIndex = selectedVariants[getSelectionKey(0)] || 0;

              // If this selector has showForIndices, only show if current first selection matches
              if (selector.showForIndices && !selector.showForIndices.includes(firstSelectorIndex)) {
                return null;
              }

              return (
                <div key={index} className="variant-selector">
                  <label className="variant-label">{selector.label}:</label>
                  <select
                    className="variant-select"
                    value={selectedVariants[getSelectionKey(index)] || 0}
                    onChange={(e) => handleSelectorChange(index, Number(e.target.value))}
                  >
                    {selector.options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        ) : (
          product.description && <p className="item-description">{product.description}</p>
        )}

        <button
          className="add-to-cart-btn"
          onClick={() => {
            const opts = getSelectedOptions();
            if (opts.length > 0) {
              const text = opts.join(' - ');
              handleAddToCart({ ...product, name: `${product.name} - ${text}`, description: text });
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

  const renderGroupedProducts = (products: Product[], groupKey: string): React.ReactElement => {
    const groupId = `group-${groupKey}`;
    const baseName = getBaseName(products[0].name);
    const selectedIndex = selectedVariants[groupId] || 0;
    const selectedProduct = products[selectedIndex] || products[0];

    return (
      <div key={groupId} className="dropdown-item grouped-product-card">
        <div className="item-header">
          <h3 className="item-name">{baseName}</h3>
          <span className="item-price">Bs. {selectedProduct.price.toFixed(2)}</span>
        </div>
        <div className="variant-selector main-variant-selector">
          <label className="variant-label">Variante:</label>
          <select
            className="variant-select"
            value={selectedIndex}
            onChange={(e) => setSelectedVariants(prev => ({ ...prev, [groupId]: Number(e.target.value) }))}
          >
            {products.map((p, i) => (
              <option key={p.id} value={i}>
                {p.name.replace(new RegExp(`^${baseName}\\s*`, 'i'), '').trim() || p.name}
              </option>
            ))}
          </select>
        </div>
        {renderProductItem(selectedProduct, true, groupKey)}
      </div>
    );
  };

  const renderProductsWithGrouping = (products: Product[]): React.ReactElement[] => {
    const grouped = groupProductsByBaseName(products);
    const items: React.ReactElement[] = [];
    grouped.forEach((group, name) => {
      if (group.length > 1) items.push(renderGroupedProducts(group, name));
      else items.push(renderProductItem(group[0]));
    });
    return items;
  };

  const getCategoryIcon = (category: Category): React.ReactNode => {
    if (!category.icon_emoji) return null;
    return (
      <span style={{
        fontSize: '24px', marginRight: '0.5rem', lineHeight: '1',
        filter: 'grayscale(100%) contrast(1.2) brightness(1.1)',
        display: 'inline-block', opacity: 0.9
      }}>
        {category.icon_emoji}
      </span>
    );
  };

  const groupProductsBySubcategory = (products: Product[]): Map<string, Product[]> => {
    const grouped = new Map<string, Product[]>();
    products.forEach(p => {
      const sub = p.subcategory || '';
      if (!grouped.has(sub)) grouped.set(sub, []);
      grouped.get(sub)?.push(p);
    });
    return grouped;
  };

  const getUniqueCategories = (cats: Category[]): Category[] => {
    const seen = new Set();
    const unique = cats.filter(cat => {
      const name = cat.name.toUpperCase().trim();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    const customOrder = [
      "TORTAS ENTERAS",
      "BEBIDAS DE AUTOR",
      "CAFETERÍA",
      "CAFETERÍA FRÍA",
      "BEBIDAS CALIENTES",
      "BEBIDAS FRÍAS",
      "BRUNCH ALL DAY",
      "DESAYUNOS",
      "SALADOS",
      "REPOSTERÍA",
      "COOKIE BAR"
    ];

    return unique.sort((a, b) => {
      const nameA = a.name.toUpperCase().trim();
      const nameB = b.name.toUpperCase().trim();

      const indexA = customOrder.findIndex(order => nameA.includes(order));
      const indexB = customOrder.findIndex(order => nameB.includes(order));

      // Si ambos están en la lista personalizada, ordenar por índice
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // Si solo A está en la lista, va antes
      if (indexA !== -1) return -1;

      // Si solo B está en la lista, va antes
      if (indexB !== -1) return 1;

      // Si ninguno está en la lista, ordenar alfabéticamente
      return nameA.localeCompare(nameB, 'es');
    });
  };

  const renderProductsInOrder = (category: Category, products: Product[]) => {
    const isTortasCategory = category.name.toUpperCase().includes('TORTAS ENTERAS');

    // Si es Tortas Enteras, forzamos un agrupamiento total de todo lo que haya dentro
    if (isTortasCategory && products.length > 0) {
      const groupId = `forced-tortas-${category.id}`;
      const selectedIndex = selectedVariants[groupId] || 0;
      const selectedProduct = products[selectedIndex] || products[0];

      return (
        <div className="subcategory-section single-subcategory">
          <div className="dropdown-item grouped-product-card">
            <div className="item-header">
              <h3 className="item-name">TORTA ENTERA</h3>
              <span className="item-price">Bs. {selectedProduct.price.toFixed(2)}</span>
            </div>
            <div className="variant-selector main-variant-selector">
              <label className="variant-label">Elige tu sabor:</label>
              <select
                className="variant-select"
                value={selectedIndex}
                onChange={(e) => setSelectedVariants(prev => ({ ...prev, [groupId]: Number(e.target.value) }))}
              >
                {products.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.name.toUpperCase().replace('PORCIÓN DE ', '').replace('TORTA ', '').trim()}
                  </option>
                ))}
              </select>
            </div>
            {selectedProduct.description && (
              <p className="item-description">{selectedProduct.description}</p>
            )}
            <button
              className="add-to-cart-btn"
              onClick={() => {
                // Nombre completo: "Torta Entera [Sabor del producto]"
                const fullName = `Torta Entera ${selectedProduct.name.replace(/porci[oó]n de /i, '').replace(/torta /i, '').trim()}`;
                handleAddToCart({ ...selectedProduct, name: fullName });
              }}
              disabled={!selectedProduct.is_available}
            >
              {selectedProduct.is_available ? 'Agregar al carrito' : 'No disponible'}
            </button>
          </div>
        </div>
      );
    }

    // Para el resto, usamos el agrupamiento estándar por subcategorías
    const subs = groupProductsBySubcategory(products);
    return Array.from(subs.entries()).map(([name, prods]) => (
      <div key={name} className="subcategory-section">
        {name && <h3 className="subcategory-title">{name}</h3>}
        <div className="subcategory-items">
          {renderProductsWithGrouping(prods)}
        </div>
      </div>
    ));
  };

  if (loading) return (
    <div className="menu-container">
      <div className="loading-message">
        <img src="/logos/logo-blanco.png" alt="Cargando..." className="loading-logo" />
      </div>
    </div>
  );

  if (error) return (
    <div className="menu-container">
      <div className="error-message"><p>Error: {error}</p></div>
    </div>
  );

  const uniqueCategories = getUniqueCategories(categories);

  return (
    <div className="menu-container">
      <div className="menu-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="menu-title">MENÚ</h1>
        <div className="menu-header-actions">
          <div className="menu-cart-icon" onClick={onOpenCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="white" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </div>
      </div>

      <div className="menu-content">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="torta-del-mes-banner">
          <img
            src="/assets/images/Tortas del Mes/torta del mes 2.webp"
            alt="Torta del Mes"
            className="torta-del-mes-img"
          />
        </div>

        <div className="categories-list">
          {uniqueCategories.map(category => {
            const products = getProductsByCategory(category.id);
            const filteredProducts = filterProducts(products);
            if (searchTerm && filteredProducts.length === 0) return null;

            return (
              <div key={category.id} className="category-dropdown">
                <button
                  className={`category-header ${activeDropdown === category.id ? 'active' : ''}`}
                  onClick={() => toggleDropdown(category.id)}
                >
                  <span className="category-name">
                    {getCategoryIcon(category)}
                    {category.name}
                  </span>
                  <svg
                    className={`dropdown-arrow ${activeDropdown === category.id ? 'rotated' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {activeDropdown === category.id && (
                  <div className="dropdown-content">
                    {renderProductsInOrder(category, searchTerm ? filteredProducts : products)}
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
