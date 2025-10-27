import React from 'react';
import './BaseComponents.css';

// Componente Button reutilizable
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };
  const sizeClasses = {
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente Card reutilizable
export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) => {
  const classes = [
    'card',
    hover ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Componente Section reutilizable
export const Section = ({ 
  children, 
  className = '', 
  id,
  background = 'dark',
  ...props 
}) => {
  const classes = [
    'section',
    `section-${background}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={classes} id={id} {...props}>
      <div className="section-container">
        {children}
      </div>
    </section>
  );
};

// Componente Title reutilizable
export const Title = ({ 
  children, 
  level = 2, 
  className = '',
  underline = false,
  ...props 
}) => {
  const Tag = `h${level}`;
  const classes = [
    'title',
    `title-${level}`,
    underline ? 'title-underline' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...props}>
      {children}
      {underline && <div className="title-underline-line"></div>}
    </Tag>
  );
};

// Componente Loading reutilizable
export const Loading = ({ 
  message = 'Cargando...', 
  size = 'medium',
  className = '' 
}) => {
  const classes = [
    'loading',
    `loading-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Componente Error reutilizable
export const ErrorMessage = ({ 
  message, 
  onRetry,
  className = '' 
}) => {
  const classes = [
    'error-message',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <Button variant="outline" size="small" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
