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
    .replace(/data:/gi, ''); // Eliminar data: URLs

  return sanitized;
};

/**
 * Sanitiza un nombre (permitir letras, espacios, acentos y caracteres especiales durante la escritura)
 */
export const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (typeof name !== 'string') {
    return '';
  }

  let sanitized = name.slice(0, maxLength);

  // Eliminar solo caracteres realmente peligrosos o inválidos, pero permitir escritura fluida
  // No hacemos trim() aquí para permitir escribir espacios
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]/g, '');

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

  // No hacemos trim() aquí para permitir escribir espacios
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
 * Detecta si un producto tiene opciones seleccionables basándose en su descripción
 * Los productos con opciones tienen descripciones con formato "Label: opción1, opción2"
 */
const hasSelectableOptions = (product: any): boolean => {
  if (!product || !product.description || typeof product.description !== 'string') {
    return false;
  }

  const isDependent = product.description.startsWith('@DEPENDENT@');
  const descContent = isDependent ? product.description.replace('@DEPENDENT@', '').trim() : product.description.trim();

  if (!descContent) {
    return false;
  }

  const parts = descContent.includes('|')
    ? descContent.split('|')
    : [descContent];

  // Verificar si alguna parte tiene el formato de selector (Label: opción1, opción2)
  return parts.some((part: string) => {
    const trimmedPart = part.trim();
    if (!trimmedPart.includes(':')) {
      return false;
    }

    // Verificar patrón con índices: "Sabor[0,1]: opción1, opción2"
    const indexMatch = trimmedPart.match(/^([^[]+)\[([0-9,]+)\]:\s*(.+)$/);
    if (indexMatch) {
      const optionsStr = indexMatch[3];
      const options = optionsStr.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0);
      return options.length > 0;
    }

    // Verificar patrón simple: "Sabor: opción1, opción2"
    const [label, optionsStr] = trimmedPart.split(':').map((s: string) => s.trim());
    if (!optionsStr) {
      return false;
    }
    const options = optionsStr.split(',').map((o: string) => o.trim()).filter((o: string) => o.length > 0);
    return options.length > 0;
  });
};

/**
 * Detecta si el nombre del producto ya contiene opciones agregadas
 * (indica que el producto ya fue procesado con opciones seleccionadas)
 */
const hasOptionsInName = (productName: string): boolean => {
  // Si el nombre contiene " - " (espacio, guión, espacio), probablemente ya tiene opciones agregadas
  // Esto es el formato usado en Menu.tsx cuando se agregan opciones: "nombre - opción1 - opción2"
  return productName.includes(' - ');
};

/**
 * Detecta si un producto pertenece a la categoría "BRUNCH ALL DAY"
 */
const isBrunchAllDay = (product: any): boolean => {
  if (!product) {
    return false;
  }

  // Verificar si la categoría es "BRUNCH ALL DAY"
  if (product.categories && product.categories.name && typeof product.categories.name === 'string') {
    const categoryName = product.categories.name.toUpperCase().trim();
    return categoryName.includes('BRUNCH ALL DAY') || categoryName === 'BRUNCH ALL DAY';
  }

  return false;
};

/**
 * Detecta si un producto es de tipo "smoothie" basándose en su nombre o subcategoría
 */
const isSmoothie = (product: any): boolean => {
  if (!product) {
    return false;
  }

  const productName = product.name ? product.name.toLowerCase().trim() : '';
  const subcategory = product.subcategory ? product.subcategory.toLowerCase().trim() : '';

  // Verificar si el nombre contiene "smoothie"
  const nameMatches = productName.includes('smoothie');

  // Verificar si la subcategoría contiene "smoothie"
  const subcategoryMatches = subcategory.includes('smoothie');

  return nameMatches || subcategoryMatches;
};

/**
 * Genera un nombre descriptivo del producto incluyendo subcategoría
 * para evitar confusiones cuando hay productos con el mismo nombre.
 * Solo aplica la subcategoría para productos de "BRUNCH ALL DAY" y "Smoothies"
 * que NO tienen opciones seleccionables.
 */
export const getProductDisplayName = (product: any): string => {
  if (!product || !product.name) {
    return 'Producto sin nombre';
  }

  const productName = product.name.trim();
  
  // Si el nombre ya contiene opciones agregadas (tiene " - "), devolver solo el nombre
  // Esto significa que el producto ya fue procesado con opciones seleccionadas
  if (hasOptionsInName(productName)) {
    return productName;
  }
  
  // Si el producto tiene opciones seleccionables en su descripción original, devolver solo el nombre
  // (las opciones se añaden al nombre cuando se agrega al carrito)
  if (hasSelectableOptions(product)) {
    return productName;
  }
  
  // Solo aplicar subcategoría para productos de "BRUNCH ALL DAY" o "Smoothies"
  const shouldAddSubcategory = isBrunchAllDay(product) || isSmoothie(product);
  
  if (shouldAddSubcategory && product.subcategory && typeof product.subcategory === 'string' && product.subcategory.trim()) {
    const subcategory = product.subcategory.trim();
    // Evitar duplicar si el nombre ya contiene la subcategoría
    if (!productName.toLowerCase().includes(subcategory.toLowerCase())) {
      return `${subcategory} - ${productName}`;
    }
  }
  
  // Para todos los demás productos, devolver solo el nombre
  return productName;
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









