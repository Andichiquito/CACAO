import React from 'react';
import './FloatingCartButton.css';
import { useCart } from '../contexts/CartContext';

interface FloatingCartButtonProps {
    onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick }) => {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    if (totalItems === 0) return null;

    return (
        <button className="floating-cart-button" onClick={onClick} aria-label="Ver carrito">
            <div className="floating-cart-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20ZM17 20C17 21.1 16.1 22 15 22C13.9 22 13 21.1 13 20C13 18.9 13.9 18 15 18C16.1 18 17 18.9 17 20ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1V2H4.27H5.21H21.75V5H20.88L17.3 11.97C16.96 12.59 16.3 13 15.55 13H8.1L7.17 14.75C7.17 14.75 7.17 14.75 7.17 14.75C7.17 14.89 7.28 15 7.42 15H19V17H7C5.9 17 5 16.1 5 15C5 14.65 5.09 14.32 5.25 14.04L6.6 11.59L3 4H1V2H3L3.68 3.52L7.17 14.75Z" fill="white" />
                </svg>
            </div>
            <span className="floating-cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
        </button>
    );
};

export default FloatingCartButton;
// End of component
