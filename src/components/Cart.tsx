import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import './Cart.css';
import {
  loadGoogleMapsScript,
  initializeMap,
  initializeAutocomplete,
  updateMapLocation,
  cleanup as cleanupGoogleMaps,
  isGoogleMapsAvailable
} from '../utils/googleMaps';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderData {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  referencia: string;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    referencia: ''
  });
  const [errors, setErrors] = useState<Partial<OrderData>>({});
  const addressInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleQuantityChange = (productId: number, newQuantity: number): void => {
    // Validar parámetros
    if (typeof productId !== 'number' || productId <= 0) {
      console.error('Cart: Invalid productId in handleQuantityChange', productId);
      return;
    }

    if (typeof newQuantity !== 'number') {
      console.error('Cart: Invalid newQuantity in handleQuantityChange', newQuantity);
      return;
    }

    try {
      if (newQuantity < 1) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error('Cart: Error changing quantity', error);
    }
  };

  // Cargar Google Maps - Versión para producción
  useEffect(() => {
    if (!showOrderModal) return;

    const initMaps = () => {
      // Esperar a que el contenedor tenga dimensiones
      const tryInit = () => {
        if (!mapRef.current || !addressInputRef.current) return false;

        const hasDimensions = mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0;
        
        if (!hasDimensions) {
          setTimeout(tryInit, 100);
          return false;
        }

        // Inicializar mapa
        if (window.google && window.google.maps && window.google.maps.Map && mapRef.current) {
          initializeMap(mapRef.current);
        }

        // Inicializar autocomplete
        if (window.google && window.google.maps && window.google.maps.places && addressInputRef.current) {
          initializeAutocomplete(addressInputRef.current, (place: any) => {
            if (place && place.formatted_address && place.geometry && place.geometry.location) {
              setOrderData(prev => ({ ...prev, direccion: place.formatted_address || '' }));
              updateMapLocation(place.geometry.location, place.formatted_address);
            }
          });
        }

        return true;
      };

      setTimeout(tryInit, 300);
    };

    // Si Google Maps ya está cargado
    if (window.google && window.google.maps && window.google.maps.Map) {
      initMaps();
    } else if ((window as any).googleMapsLoaded) {
      // Si el callback ya se ejecutó
      initMaps();
    } else {
      // Esperar al callback
      (window as any).onGoogleMapsReady = () => {
        initMaps();
      };
      
      // Verificar periódicamente si ya está cargado
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          clearInterval(checkInterval);
          initMaps();
        }
      }, 200);
      
      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    return () => {
      cleanupGoogleMaps();
    };
  }, [showOrderModal]);

  const handleViewOrder = (): void => {
    const totalItems = getTotalItems();
    if (totalItems <= 0) {
      alert('El carrito está vacío. Agrega productos antes de ver el pedido.');
      return;
    }
    setShowOrderModal(true);
  };

  const handleInputChange = (field: keyof OrderData, value: string): void => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = (): boolean => {
    return (
      orderData.nombre.trim() !== '' &&
      orderData.telefono.trim() !== '' &&
      /^[0-9+\-\s()]+$/.test(orderData.telefono) &&
      orderData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email) &&
      orderData.direccion.trim() !== ''
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderData> = {};

    if (!orderData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!orderData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^[0-9+\-\s()]+$/.test(orderData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    if (!orderData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!orderData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmOrder = (): void => {
    if (!validateForm()) {
      return;
    }

    try {
      const totalPrice = getTotalPrice();
      const totalItems = getTotalItems();

      // Validar que haya items en el carrito
      if (totalItems <= 0) {
        alert('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
        return;
      }

      // Validar que el total sea válido
      if (!isFinite(totalPrice) || totalPrice < 0) {
        console.error('Cart: Invalid total price calculated', totalPrice);
        alert('Error al calcular el total. Por favor, intenta nuevamente.');
        return;
      }

      // Aquí puedes agregar la lógica de checkout con los datos del pedido
      console.log('Datos del pedido:', orderData);
      alert(`Pedido confirmado!\n\nCliente: ${orderData.nombre}\nTeléfono: ${orderData.telefono}\nDirección: ${orderData.direccion}\nTotal: Bs. ${totalPrice.toFixed(2)}`);
      
      // Limpiar formulario y cerrar modales
      setOrderData({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        referencia: ''
      });
      setShowOrderModal(false);
      clearCart();
      onClose();
    } catch (error) {
      console.error('Cart: Error during checkout', error);
      alert('Error al procesar el pedido. Por favor, intenta nuevamente.');
    }
  };

  const handleCloseOrderModal = (): void => {
    setShowOrderModal(false);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Carrito de Compras</h2>
          <button 
            className="cart-close-button"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="currentColor" opacity="0.3"/>
              </svg>
              <p className="cart-empty-text">Tu carrito está vacío</p>
              <p className="cart-empty-subtext">Agrega productos del menú para comenzar</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {Array.isArray(items) && items.length > 0 ? (
                  items.map((item) => {
                    // Validar item antes de renderizar
                    if (!item || !item.product) {
                      console.warn('Cart: Invalid item found, skipping', item);
                      return null;
                    }

                    const product = item.product;
                    const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
                    const price = typeof product.price === 'number' && product.price >= 0 ? product.price : 0;
                    const subtotal = price * quantity;
                    const isValidSubtotal = isFinite(subtotal) && subtotal >= 0;

                    return (
                      <div key={product.id} className="cart-item">
                        <div className="cart-item-info">
                          <h3 className="cart-item-name">{product.name || 'Producto sin nombre'}</h3>
                          <p className="cart-item-price">
                            Bs. {isValidSubtotal ? price.toFixed(2) : '0.00'}
                          </p>
                        </div>
                        
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button
                              className="quantity-button"
                              onClick={() => handleQuantityChange(product.id, quantity - 1)}
                              aria-label="Disminuir cantidad"
                              disabled={quantity <= 1}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                              className="quantity-button"
                              onClick={() => handleQuantityChange(product.id, quantity + 1)}
                              aria-label="Aumentar cantidad"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div className="cart-item-subtotal">
                            <span className="subtotal-label">Subtotal:</span>
                            <span className="subtotal-value">
                              Bs. {isValidSubtotal ? subtotal.toFixed(2) : '0.00'}
                            </span>
                          </div>
                          
                          <button
                            className="cart-item-remove"
                            onClick={() => removeFromCart(product.id)}
                            aria-label="Eliminar producto"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="cart-empty">
                    <p>Error al cargar los items del carrito</p>
                  </div>
                )}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span className="summary-label">Total de items:</span>
                    <span className="summary-value">
                      {(() => {
                        const total = getTotalItems();
                        return typeof total === 'number' && total >= 0 ? total : 0;
                      })()}
                    </span>
                  </div>
                  <div className="cart-summary-row cart-total">
                    <span className="summary-label">Total a pagar:</span>
                    <span className="summary-value">
                      Bs. {(() => {
                        const total = getTotalPrice();
                        return typeof total === 'number' && isFinite(total) && total >= 0 
                          ? total.toFixed(2) 
                          : '0.00';
                      })()}
                    </span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button
                    className="cart-button cart-button-secondary"
                    onClick={clearCart}
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    className="cart-button cart-button-primary"
                    onClick={handleViewOrder}
                  >
                    Ver Pedido
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Datos del Pedido */}
      {showOrderModal && (
        <div className="order-modal-overlay" onClick={handleCloseOrderModal}>
          <div className="order-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2 className="order-modal-title">Datos del Pedido</h2>
              <button 
                className="order-modal-close-button"
                onClick={handleCloseOrderModal}
                aria-label="Cerrar modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="order-modal-content">
              <div className="order-form">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre Completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className={`form-input ${errors.nombre ? 'form-input-error' : ''}`}
                    value={orderData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    className={`form-input ${errors.telefono ? 'form-input-error' : ''}`}
                    value={orderData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Ej: 70012345"
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    value={orderData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="direccion" className="form-label">
                    Dirección de Entrega <span className="required">*</span>
                  </label>
                  <input
                    ref={addressInputRef}
                    type="text"
                    id="direccion"
                    className={`form-input ${errors.direccion ? 'form-input-error' : ''}`}
                    value={orderData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Busca tu dirección en el mapa"
                  />
                  {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                  <p className="form-hint">Escribe tu dirección y selecciona una opción del mapa</p>
                  
                  {/* Mapa de Google Maps */}
                  <div 
                    ref={mapRef}
                    className="google-map-container"
                    style={{ height: '300px', width: '100%', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', minHeight: '300px' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="referencia" className="form-label">
                    Referencia (Opcional)
                  </label>
                  <textarea
                    id="referencia"
                    className="form-input form-textarea"
                    value={orderData.referencia}
                    onChange={(e) => handleInputChange('referencia', e.target.value)}
                    placeholder="Ej: Casa de color azul, portón negro, etc."
                    rows={3}
                  />
                </div>

                <div className="order-summary">
                  <div className="order-summary-row">
                    <span className="summary-label">Total de items:</span>
                    <span className="summary-value">{getTotalItems()}</span>
                  </div>
                  <div className="order-summary-row order-summary-total">
                    <span className="summary-label">Total a pagar:</span>
                    <span className="summary-value">Bs. {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <button
                className="cart-button cart-button-secondary"
                onClick={handleCloseOrderModal}
              >
                Cancelar
              </button>
              <button
                className="cart-button cart-button-primary"
                onClick={handleConfirmOrder}
                disabled={!isFormValid()}
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

