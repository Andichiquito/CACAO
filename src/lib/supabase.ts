import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Validar y obtener variables de entorno
const getSupabaseUrl = (): string => {
  const url = process.env.REACT_APP_SUPABASE_URL || 'https://nuggxbpabupxkhlmreod.supabase.co';
  
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    console.error('Supabase: Invalid or missing REACT_APP_SUPABASE_URL');
    throw new Error('Configuración de Supabase URL inválida');
  }

  // Validar formato de URL
  try {
    new URL(url);
  } catch (error) {
    console.error('Supabase: Invalid URL format', url);
    throw new Error('Formato de URL de Supabase inválido');
  }

  return url;
};

const getSupabaseKey = (): string => {
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';
  
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    console.error('Supabase: Invalid or missing REACT_APP_SUPABASE_ANON_KEY');
    throw new Error('Configuración de Supabase Key inválida');
  }

  return key;
};

// Crear cliente de Supabase con validación
let supabaseClient: SupabaseClient | null = null;

try {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();
  
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  // Validar que el cliente se haya creado correctamente
  if (!supabaseClient) {
    throw new Error('No se pudo crear el cliente de Supabase');
  }
} catch (error) {
  console.error('Error inicializando Supabase:', error);
  // En desarrollo, podríamos querer lanzar el error
  // En producción, podríamos querer crear un cliente mock o manejar el error de otra manera
  throw error;
}

export const supabase: SupabaseClient = supabaseClient!;


