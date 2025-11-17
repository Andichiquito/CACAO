import React from 'react';
import { useCart } from '../hooks/useCart';
import './Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number): void => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = (): void => {
    // Aquí puedes agregar la lógica de checkout
    alert(`Pedido confirmado!\n\nTotal: Bs. ${getTotalPrice().toFixed(2)}`);
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
                {items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-price">Bs. {item.product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-button"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-button"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="cart-item-subtotal">
                        <span className="subtotal-label">Subtotal:</span>
                        <span className="subtotal-value">Bs. {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Eliminar producto"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span className="summary-label">Total de items:</span>
                    <span className="summary-value">{getTotalItems()}</span>
                  </div>
                  <div className="cart-summary-row cart-total">
                    <span className="summary-label">Total a pagar:</span>
                    <span className="summary-value">Bs. {getTotalPrice().toFixed(2)}</span>
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
                    onClick={handleCheckout}
                  >
                    Confirmar Pedido
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

