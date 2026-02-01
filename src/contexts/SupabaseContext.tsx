import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { SupabaseContextType } from '../types';

/**
 * Contexto de Supabase para gestionar la autenticación y la sesión del usuario.
 * Proporciona acceso al cliente de supabase y funciones de login/registro.
 */
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

/**
 * Hook personalizado para acceder fácilmente al contexto de Supabase.
 * @returns El contexto de Supabase con el usuario actual y funciones de auth.
 */
export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Obtener la sesión inicial al cargar la aplicación
    const getInitialSession = async (): Promise<void> => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 2. Suscribirse a cambios en el estado de autenticación (Login, Logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpiar suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Inicia sesión con email y contraseña.
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión',
        error
      };
    }
  };

  /**
   * Registra un nuevo usuario y crea su perfil en la tabla de base de datos.
   */
  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      // ETAPA 1: Registro en Supabase Auth (Sistema interno de usuarios)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // ETAPA 2: Crear entrada en la tabla 'profiles' para datos adicionales persistentes
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
              phone: phone,
              role: 'customer',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Si falla el perfil, registramos el error pero no bloqueamos al usuario (ya está en Auth)
        }
      }

      return {
        success: true,
        message: '¡Registro exitoso! Por favor verifica tu correo si es necesario.'
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return {
        success: false,
        message: error.message || 'Error al registrarse',
        error
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return {
        success: false,
        message: error.message || 'Error al cerrar sesión',
        error
      };
    }
  };

  const value = {
    supabase,
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

