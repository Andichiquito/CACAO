/**
 * Utilidades de seguridad para prevenir vulnerabilidades comunes
 */

/**
 * Sanitiza un string para prevenir XSS
 * Elimina caracteres peligrosos y escapa HTML
 */
export const sanitizeInput = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Limitar longitud
  let sanitized = input.slice(0, maxLength);

  // Eliminar caracteres de control y scripts peligrosos
  sanitized = sanitized
    .replace(/[<>]/g, '') // Eliminar < y >
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+=/gi, '') // Eliminar event handlers (onclick=, onerror=, etc.)
    .replace(/data:/gi, '') // Eliminar data: URLs
    .trim();

  return sanitized;
};

/**
 * Sanitiza un nombre (solo letras, espacios, acentos y algunos caracteres especiales)
 */
export const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (typeof name !== 'string') {
    return '';
  }

  let sanitized = name.slice(0, maxLength);
  
  // Solo permitir letras, espacios, acentos y algunos caracteres especiales
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'\.]/g, '');
  
  // Limitar espacios múltiples
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
};

/**
 * Sanitiza una dirección
 */
export const sanitizeAddress = (address: string, maxLength: number = 200): string => {
  if (typeof address !== 'string') {
    return '';
  }

  let sanitized = address.slice(0, maxLength);
  
  // Permitir letras, números, espacios, acentos y caracteres comunes de direcciones
  sanitized = sanitized.replace(/[<>]/g, ''); // Eliminar < y >
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+=/gi, '');
  
  // Limitar espacios múltiples
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
};

/**
 * Sanitiza texto para WhatsApp (escapa caracteres especiales de formato)
 */
export const sanitizeForWhatsApp = (text: string): string => {
  if (typeof text !== 'string') {
    return '';
  }

  // Escapar caracteres especiales de formato de WhatsApp que podrían causar problemas
  return text
    .replace(/\*/g, '\\*') // Escapar asteriscos
    .replace(/_/g, '\\_') // Escapar guiones bajos
    .replace(/~/g, '\\~') // Escapar tildes
    .replace(/`/g, '\\`') // Escapar backticks
    .replace(/#/g, '\\#'); // Escapar numerales
};

/**
 * Valida coordenadas geográficas
 */
export const validateCoordinates = (lat: number, lng: number): boolean => {
  // Validar que sean números
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  // Validar que no sean NaN o Infinity
  if (!isFinite(lat) || !isFinite(lng)) {
    return false;
  }

  // Validar rango de latitud (-90 a 90)
  if (lat < -90 || lat > 90) {
    return false;
  }

  // Validar rango de longitud (-180 a 180)
  if (lng < -180 || lng > 180) {
    return false;
  }

  // Validar que estén en el rango aproximado de Bolivia/Cochabamba
  // Latitud: aproximadamente -17.5 a -16.5
  // Longitud: aproximadamente -66.5 a -65.5
  // Pero permitir un rango más amplio por si acaso
  if (lat < -20 || lat > -15 || lng < -68 || lng > -64) {
    console.warn('Coordinates outside expected range for Cochabamba, Bolivia');
    // No rechazar, solo advertir, por si alguien necesita entregar fuera del área
  }

  return true;
};

/**
 * Valida y sanitiza un número de teléfono
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }

  // Solo permitir números
  return phone.replace(/[^0-9]/g, '').slice(0, 8);
};






