import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import './Cart.css';
import {
  initializeMap,
  updateMapLocation,
  cleanup as cleanupMap
} from '../utils/leafletMap';
import { sanitizeInput, sanitizeName, sanitizeAddress, sanitizeForWhatsApp, validateCoordinates, sanitizePhone } from '../utils/security';
import { useSupabase } from '../contexts/SupabaseContext';
import 'leaflet/dist/leaflet.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderData {
  nombre: string;
  telefono: string;
  gmail: string;
  nit_ci: string;
  razon_social: string;
  direccion: string;
  referencia: string;
  notas: string;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { user, supabase } = useSupabase();
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    nombre: '',
    telefono: '',
    gmail: '',
    nit_ci: '',
    razon_social: '',
    direccion: '',
    referencia: '',
    notas: ''
  });
  const [errors, setErrors] = useState<Partial<OrderData>>({});
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleQuantityChange = (productId: number, newQuantity: number): void => {

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


  useEffect(() => {
    if (showOrderModal && user) {
      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setOrderData(prev => ({
              ...prev,
              nombre: prev.nombre || data.full_name || '',
              telefono: prev.telefono || data.phone || '',
              gmail: prev.gmail || user.email || ''
            }));
          } else {
            // Si no hay perfil aún, al menos cargar el email
            setOrderData(prev => ({
              ...prev,
              gmail: prev.gmail || user.email || ''
            }));
          }
        } catch (err) {
          console.error('Error pre-filling order data:', err);
        }
      };
      fetchProfileData();
    }
  }, [showOrderModal, user, supabase]);

  useEffect(() => {
    if (!showOrderModal) return;

    const initMap = async () => {

      const tryInit = () => {
        if (!mapRef.current) return false;

        const hasDimensions = mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0;

        if (!hasDimensions) {
          setTimeout(tryInit, 100);
          return false;
        }


        if (mapRef.current) {
          initializeMap(mapRef.current, (address: string, lat: number, lng: number) => {

            if (!validateCoordinates(lat, lng)) {
              console.error('Invalid coordinates received from map:', lat, lng);
              return;
            }


            const sanitizedAddress = sanitizeAddress(address, 200);
            setOrderData(prev => ({ ...prev, direccion: sanitizedAddress }));
            setSelectedLocation({ lat, lng });
            setErrors(prev => {
              if (prev.direccion) {
                return { ...prev, direccion: undefined };
              }
              return prev;
            });
          }).catch((error: any) => {
            console.error('Error al inicializar mapa:', error);
          });
        }

        return true;
      };

      setTimeout(tryInit, 300);
    };

    initMap();

    return () => {
      cleanupMap();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOrderModal]);

  const handleViewOrder = (): void => {
    const totalItems = getTotalItems();
    if (totalItems <= 0) {
      alert('El carrito está vacío. Agrega productos antes de ver el pedido.');
      return;
    }
    setShowOrderModal(true);
  };

  const handleTelefonoChange = (value: string): void => {

    const sanitized = sanitizePhone(value);


    if (sanitized === '') {
      setOrderData(prev => ({ ...prev, telefono: '' }));
      if (errors.telefono) {
        setErrors(prev => ({ ...prev, telefono: undefined }));
      }
      return;
    }


    if (sanitized.length > 0 && !/^[67]/.test(sanitized)) {

      return;
    }

    setOrderData(prev => ({ ...prev, telefono: sanitized }));

    if (errors.telefono) {
      setErrors(prev => ({ ...prev, telefono: undefined }));
    }
  };

  const handleInputChange = (field: keyof OrderData, value: string): void => {

    if (field === 'telefono') {
      handleTelefonoChange(value);
      return;
    }


    let sanitizedValue = value;
    if (field === 'nombre') {
      sanitizedValue = sanitizeName(value, 100);
    } else if (field === 'direccion') {
      sanitizedValue = sanitizeAddress(value, 200);
    } else if (field === 'referencia' || field === 'notas') {
      sanitizedValue = sanitizeInput(value, 500);
    }

    setOrderData(prev => ({ ...prev, [field]: sanitizedValue }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Limpiar gmail si se borran los datos de facturación
    if ((field === 'nit_ci' || field === 'razon_social') && sanitizedValue.trim() === '') {
      const otherField = field === 'nit_ci' ? 'razon_social' : 'nit_ci';
      if (orderData[otherField].trim() === '') {
        setOrderData(prev => ({ ...prev, gmail: '', [field]: sanitizedValue }));
        return; // Retornamos aquí porque ya actualizamos el estado
      }
    }


    if (field === 'direccion' && value.trim().length > 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }


      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        await updateMapLocation(value);
        setIsSearching(false);
      }, 2500); // Esperar 2.5 segundos después de que el usuario deje de escribir
    } else if (field === 'direccion' && value.trim().length === 0) {

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  const handleAddressKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();


      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      const address = orderData.direccion.trim();

      if (address.length > 0) {
        setIsSearching(true);
        await updateMapLocation(address);
        setIsSearching(false);

      }
    }
  };

  const isFormValid = (): boolean => {
    const cleanPhone = orderData.telefono.replace(/[\s\-()]/g, '');
    const phoneValid = cleanPhone.length >= 7 && cleanPhone.length <= 8 && /^[67][0-9]{6,7}$/.test(cleanPhone);

    return (
      orderData.nombre.trim() !== '' &&
      orderData.telefono.trim() !== '' &&
      phoneValid &&
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
    } else {

      const cleanPhone = orderData.telefono.replace(/[\s\-()]/g, '');

      if (!/^[67][0-9]{6,7}$/.test(cleanPhone)) {
        newErrors.telefono = 'El teléfono debe empezar por 6 o 7 y tener 7 a 8 números';
      }
    }


    if (!orderData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    } else if (!selectedLocation) {
      newErrors.direccion = 'Por favor, selecciona tu ubicación en el mapa arrastrando el pin';
    }

    // Validar facturación condicional
    const hasBillingData = orderData.nit_ci.trim() !== '' || orderData.razon_social.trim() !== '';
    if (hasBillingData && !orderData.gmail.trim()) {
      newErrors.gmail = 'El correo es obligatorio para facturación';
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


      if (totalItems <= 0) {
        alert('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
        return;
      }


      if (!isFinite(totalPrice) || totalPrice < 0) {
        console.error('Cart: Invalid total price calculated', totalPrice);
        alert('Error al calcular el total. Por favor, intenta nuevamente.');
        return;
      }


      if (selectedLocation && !validateCoordinates(selectedLocation.lat, selectedLocation.lng)) {
        alert('La ubicación seleccionada no es válida. Por favor, selecciona una ubicación válida en el mapa.');
        return;
      }


      const sanitizedName = sanitizeForWhatsApp(orderData.nombre.trim());
      const sanitizedPhone = orderData.telefono.trim();
      const sanitizedGmail = orderData.gmail.trim() ? sanitizeForWhatsApp(orderData.gmail.trim()) : '';
      const sanitizedNitCi = orderData.nit_ci.trim() ? sanitizeForWhatsApp(orderData.nit_ci.trim()) : '';
      const sanitizedRazonSocial = orderData.razon_social.trim() ? sanitizeForWhatsApp(orderData.razon_social.trim()) : '';
      const sanitizedAddress = sanitizeForWhatsApp(orderData.direccion.trim());
      const sanitizedReferencia = orderData.referencia.trim() ? sanitizeForWhatsApp(orderData.referencia.trim()) : '';
      const sanitizedNotas = orderData.notas.trim() ? sanitizeForWhatsApp(orderData.notas.trim()) : '';


      let whatsappMessage = `*PEDIDO CACAO*\n\n`;
      whatsappMessage += `*Cliente:* ${sanitizedName}\n`;
      whatsappMessage += `*Teléfono:* ${sanitizedPhone}\n`;


      if (sanitizedGmail || sanitizedNitCi || sanitizedRazonSocial) {
        whatsappMessage += `\n*DATOS DE FACTURACIÓN:*\n`;
        if (sanitizedGmail) {
          whatsappMessage += `*Gmail:* ${sanitizedGmail}\n`;
        }
        if (sanitizedNitCi) {
          whatsappMessage += `*NIT/CI:* ${sanitizedNitCi}\n`;
        }
        if (sanitizedRazonSocial) {
          whatsappMessage += `*Razón Social:* ${sanitizedRazonSocial}\n`;
        }
      }
      whatsappMessage += `\n`;


      whatsappMessage += `*Dirección:* ${sanitizedAddress}\n`;
      if (selectedLocation && validateCoordinates(selectedLocation.lat, selectedLocation.lng)) {
        const mapsLink = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
        whatsappMessage += `${mapsLink}\n\n`;
      } else {
        whatsappMessage += `\n*Nota:* Por favor, confirma que la dirección es correcta\n\n`;
      }


      if (sanitizedReferencia) {
        whatsappMessage += `*Referencia:* ${sanitizedReferencia}\n\n`;
      }


      whatsappMessage += `*PEDIDO:*\n`;
      items.forEach((item) => {
        if (!item || !item.product) return;
        const productName = sanitizeForWhatsApp(item.product.name || 'Producto sin nombre');
        const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
        const price = typeof item.product.price === 'number' && item.product.price >= 0 ? item.product.price : 0;
        const subtotal = price * quantity;
        whatsappMessage += `• ${productName} x${quantity} = Bs. ${subtotal.toFixed(2)}\n`;
      });

      whatsappMessage += `\n*TOTAL: Bs. ${totalPrice.toFixed(2)}*\n`;


      if (sanitizedNotas) {
        whatsappMessage += `\n*NOTAS:*\n${sanitizedNotas}\n`;
      }


      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappNumber = '59179797033'; // Número sin el +
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


      window.open(whatsappUrl, '_blank');


      setOrderData({
        nombre: '',
        telefono: '',
        gmail: '',
        nit_ci: '',
        razon_social: '',
        direccion: '',
        referencia: '',
        notas: ''
      });
      setSelectedLocation(null);
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

    document.body.classList.remove('modal-open');
  };


  useEffect(() => {
    if (showOrderModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showOrderModal]);

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
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="currentColor" opacity="0.3" />
              </svg>
              <p className="cart-empty-text">Tu carrito está vacío</p>
              <p className="cart-empty-subtext">Agrega productos del menú para comenzar</p>
            </div>
          ) : (
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
                              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <span className="quantity-value">{quantity}</span>
                          <button
                            className="quantity-button"
                            onClick={() => handleQuantityChange(product.id, quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          )}
        </div>

        {items.length > 0 && (
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
        )}
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
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    placeholder="Ej: 70012345 o 6123456"
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>

                {/* Sección de Datos de Facturación */}
                <div style={{ marginTop: '1.5rem', marginBottom: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#d4af37' }}>Datos de Facturación (Opcional)</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="nit_ci" className="form-label">
                    NIT o CI
                  </label>
                  <input
                    type="text"
                    id="nit_ci"
                    className="form-input"
                    value={orderData.nit_ci}
                    onChange={(e) => handleInputChange('nit_ci', e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="razon_social" className="form-label">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    id="razon_social"
                    className="form-input"
                    value={orderData.razon_social}
                    onChange={(e) => handleInputChange('razon_social', e.target.value)}
                    placeholder=""
                  />
                </div>

                {(orderData.nit_ci.trim() !== '' || orderData.razon_social.trim() !== '') && (
                  <div className="form-group">
                    <label htmlFor="gmail" className="form-label">
                      Gmail <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="gmail"
                      className={`form-input ${errors.gmail ? 'form-input-error' : ''}`}
                      value={orderData.gmail}
                      onChange={(e) => handleInputChange('gmail', e.target.value)}
                      placeholder="tucorreo@gmail.com"
                    />
                    {errors.gmail && <span className="error-message">{errors.gmail}</span>}
                  </div>
                )}


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
                    onKeyDown={handleAddressKeyDown}
                    placeholder="Ej: J J Carras 1617, Cochabamba (presiona Enter para buscar)"
                    disabled={isSearching}
                  />
                  {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                  <p className="form-hint">
                    {isSearching ? 'Buscando dirección en Cochabamba...' : 'Escribe tu dirección en Cochabamba o usa el mapa para seleccionar tu ubicación'}
                  </p>

                  {/* Mapa de OpenStreetMap */}
                  <div
                    ref={mapRef}
                    className="google-map-container"
                    style={{ height: '300px', width: '100%', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', minHeight: '300px' }}
                  />

                  {/* Mensaje sobre ajustar ubicación */}
                  <p className="form-hint" style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.9rem',
                    color: '#d4af37'
                  }}>
                    ⚠️ <strong>Si la ubicación no es correcta, por favor arrastra el pin a tu ubicación exacta en el mapa</strong>
                  </p>

                  {/* Link a Google Maps cuando hay una ubicación seleccionada */}
                  {selectedLocation && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                      style={{
                        display: 'inline-block',
                        marginTop: '0.75rem',
                        color: '#4285F4',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        borderRadius: '6px',
                        border: '1px solid rgba(66, 133, 244, 0.3)'
                      }}
                    >
                      📍 Ver ubicación en Google Maps
                    </a>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="referencia" className="form-label">
                    Referencia de Dirección (Opcional)
                  </label>
                  <textarea
                    id="referencia"
                    className="form-input form-textarea"
                    value={orderData.referencia}
                    onChange={(e) => handleInputChange('referencia', e.target.value)}
                    placeholder="Ej: Casa de color azul, portón negro, etc."
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notas" className="form-label">
                    Notas del Pedido (Opcional)
                  </label>
                  <textarea
                    id="notas"
                    className="form-input form-textarea"
                    value={orderData.notas}
                    onChange={(e) => handleInputChange('notas', e.target.value)}
                    placeholder="Ej: Sin cebolla, extra queso, entregar después de las 6pm..."
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

