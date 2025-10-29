// Test de conexión a Supabase
import { supabase } from './lib/supabase.js'

async function testSupabaseConnection() {
  try {
    console.log('Probando conexión a Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error de conexión:', error)
      return false
    }
    
    console.log('✅ Conexión exitosa a Supabase!')
    console.log('Datos de prueba:', data)
    return true
    
  } catch (err) {
    console.error('Error inesperado:', err)
    return false
  }
}

// Ejecutar test si se llama directamente
if (typeof window !== 'undefined') {
  testSupabaseConnection()
}

export { testSupabaseConnection }

