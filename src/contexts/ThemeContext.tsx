import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para el tema
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderHover: string;
  shadow: string;
  shadowHover: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeFonts {
  primary: string;
  heading: string;
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

interface ThemeTransitions {
  fast: string;
  normal: string;
  slow: string;
}

interface Theme {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
}

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  toggleTheme: () => void;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

// Context para el tema
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para usar el tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Definición de temas
const themes: Record<string, Theme> = {
  dark: {
    name: 'dark',
    colors: {
      primary: '#D4AF37',
      secondary: '#FFD700',
      background: '#000000',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      textSecondary: '#e0e0e0',
      textMuted: '#888888',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(212, 175, 55, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',
      error: '#ff6b6b',
      success: '#51cf66',
      warning: '#ffd43b',
      info: '#74c0fc'
    },
    fonts: {
      primary: "'Readex Pro', sans-serif",
      heading: "'Readex Pro', sans-serif",
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      weights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '50%'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)'
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease'
    }
  },
  light: {
    name: 'light',
    colors: {
      primary: '#D4AF37',
      secondary: '#FFD700',
      background: '#ffffff',
      surface: 'rgba(0, 0, 0, 0.05)',
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      border: 'rgba(0, 0, 0, 0.1)',
      borderHover: 'rgba(212, 175, 55, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowHover: 'rgba(0, 0, 0, 0.15)',
      error: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8'
    },
    fonts: {
      primary: "'Readex Pro', sans-serif",
      heading: "'Readex Pro', sans-serif",
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      weights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '50%'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)'
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease'
    }
  }
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

// Provider del tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);

  // Cargar tema guardado del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('cacao-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Guardar tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cacao-theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = (): void => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (themeName: string): void => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value: ThemeContextType = {
    theme: themes[currentTheme],
    themeName: currentTheme,
    toggleTheme,
    setTheme,
    availableThemes: Object.keys(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Componente para aplicar estilos CSS variables
export const ThemeStyles: React.FC = () => {
  const { theme } = useTheme();

  const cssVariables: Record<string, string> = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-text-muted': theme.colors.textMuted,
    '--color-border': theme.colors.border,
    '--color-border-hover': theme.colors.borderHover,
    '--color-shadow': theme.colors.shadow,
    '--color-shadow-hover': theme.colors.shadowHover,
    '--color-error': theme.colors.error,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-info': theme.colors.info,
    '--font-primary': theme.fonts.primary,
    '--font-heading': theme.fonts.heading,
    '--transition-fast': theme.transitions.fast,
    '--transition-normal': theme.transitions.normal,
    '--transition-slow': theme.transitions.slow
  };

  return (
    <style>
      {`:root {
        ${Object.entries(cssVariables)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n        ')}
      }`}
    </style>
  );
};

