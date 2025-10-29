import React, { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';
import './BaseComponents.css';

// Tipos para los componentes base
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'dark' | 'light' | 'transparent';
}

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  underline?: boolean;
}

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

// Componente Button reutilizable
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };
  const sizeClasses: Record<string, string> = {
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
export const Card: React.FC<CardProps> = ({ 
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
export const Section: React.FC<SectionProps> = ({ 
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
export const Title: React.FC<TitleProps> = ({ 
  children, 
  level = 2, 
  className = '',
  underline = false,
  ...props 
}) => {
  const classes = [
    'title',
    `title-${level}`,
    underline ? 'title-underline' : '',
    className
  ].filter(Boolean).join(' ');

  const headingProps = {
    className: classes,
    ...props
  };

  switch (level) {
    case 1:
      return (
        <h1 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h1>
      );
    case 2:
      return (
        <h2 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h2>
      );
    case 3:
      return (
        <h3 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h3>
      );
    case 4:
      return (
        <h4 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h4>
      );
    case 5:
      return (
        <h5 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h5>
      );
    case 6:
      return (
        <h6 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h6>
      );
    default:
      return (
        <h2 {...headingProps}>
          {children}
          {underline && <div className="title-underline-line"></div>}
        </h2>
      );
  }
};

// Componente Loading reutilizable
export const Loading: React.FC<LoadingProps> = ({ 
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
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
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

