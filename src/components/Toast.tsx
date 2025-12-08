import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
    id: string;
    title: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, message, duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            // Wait for animation to finish before removing
            setTimeout(() => {
                onClose(id);
            }, 300); // 300ms matches CSS transition if we added one (but we using generic slideIn, we can add slideOut later if needed)
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <div className={`toast ${isExiting ? 'exiting' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="toast-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor" />
                </svg>
            </div>
            <div className="toast-content">
                <p className="toast-title">{title}</p>
                <p className="toast-message">{message}</p>
            </div>
        </div>
    );
};

export default Toast;
