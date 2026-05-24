/**
 * Utilidades de horario para CACAO - Cochabamba, Bolivia (UTC-4)
 * Bolivia NO tiene horario de verano, siempre es UTC-4.
 *
 * Turnos:
 *  Mañana:  09:00 - 12:30  (cierre de pedidos: 12:10)
 *  Tarde:   16:00 - 20:00  (cierre de pedidos: 19:40)
 */

export type RestaurantStatus =
  | 'open'          // Dentro del horario, acepta pedidos
  | 'closing_soon'  // Próximo a cerrar (opcional, por si quieres usarlo después)
  | 'between_shifts'// Entre el 1er y 2do turno (vuelve a las 4 pm)
  | 'closed';       // Fuera de horario (antes de 9am o después de 19:40)

export interface BusinessHoursState {
  status: RestaurantStatus;
  isAcceptingOrders: boolean;
  message: string;
  subMessage?: string;
}

/**
 * Obtiene la hora actual en Bolivia (UTC-4), sin importar dónde esté el cliente.
 */
export function getBoliviaTime(): Date {
  const now = new Date();
  // UTC offset Bolivia = -4 horas
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const boliviaMs = utcMs + (-4 * 60 * 60 * 1000);
  return new Date(boliviaMs);
}

/**
 * Convierte horas y minutos a minutos totales desde medianoche.
 */
function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Evalúa el estado actual del restaurante basándose en la hora de Bolivia.
 */
export function getBusinessHoursState(): BusinessHoursState {
  const now = getBoliviaTime();
  const currentMinutes = toMinutes(now.getHours(), now.getMinutes());
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  // ----------------------------------------------------------------
  // Domingo: no atendemos
  // ----------------------------------------------------------------
  if (dayOfWeek === 0) {
    return {
      status: 'closed',
      isAcceptingOrders: false,
      message: 'Hoy es domingo, no atendemos 😴',
      subMessage: 'Volvemos el lunes a las 9:00 AM. ¡Que descanses!',
    };
  }

  // --- Definición de horarios (en minutos desde medianoche) ---
  const MORNING_OPEN        = toMinutes(9, 0);    // 09:00
  const MORNING_ORDER_CLOSE = toMinutes(12, 10);  // 12:10 - cierre de pedidos
  const MORNING_CLOSE       = toMinutes(12, 30);  // 12:30 - cierre local

  const AFTERNOON_OPEN        = toMinutes(16, 0);  // 16:00
  const AFTERNOON_ORDER_CLOSE = toMinutes(19, 40); // 19:40 - cierre de pedidos
  const AFTERNOON_CLOSE       = toMinutes(20, 0);  // 20:00 - cierre local

  // ----------------------------------------------------------------
  // Antes de la apertura de mañana o después del cierre de tarde
  // ----------------------------------------------------------------
  if (currentMinutes < MORNING_OPEN || currentMinutes >= AFTERNOON_CLOSE) {
    return {
      status: 'closed',
      isAcceptingOrders: false,
      message: '🌙 El restaurante está cerrado',
      subMessage: 'Volvemos mañana a las 9:00 AM. ¡Hasta pronto!',
    };
  }

  // ----------------------------------------------------------------
  // Turno de mañana: pedidos aceptados
  // ----------------------------------------------------------------
  if (currentMinutes >= MORNING_OPEN && currentMinutes < MORNING_ORDER_CLOSE) {
    return {
      status: 'open',
      isAcceptingOrders: true,
      message: '✅ Estamos abiertos',
      subMessage: 'Horario de atención: 9:00 AM - 12:30 PM',
    };
  }

  // ----------------------------------------------------------------
  // Turno de mañana: pedidos cerrados pero local aún abierto (12:10 - 12:30)
  // ----------------------------------------------------------------
  if (currentMinutes >= MORNING_ORDER_CLOSE && currentMinutes < MORNING_CLOSE) {
    return {
      status: 'between_shifts',
      isAcceptingOrders: false,
      message: '⏸️ Pedidos cerrados por el momento',
      subMessage: 'Ya no aceptamos más pedidos en este turno. Volvemos a las 4:00 PM. ¡Te esperamos!',
    };
  }

  // ----------------------------------------------------------------
  // Entre turnos: 12:30 - 16:00
  // ----------------------------------------------------------------
  if (currentMinutes >= MORNING_CLOSE && currentMinutes < AFTERNOON_OPEN) {
    return {
      status: 'between_shifts',
      isAcceptingOrders: false,
      message: '😴 Estamos en descanso',
      subMessage: 'La página vuelve a activarse a las 4:00 PM. ¡Volvemos con todo!',
    };
  }

  // ----------------------------------------------------------------
  // Turno de tarde: pedidos aceptados
  // ----------------------------------------------------------------
  if (currentMinutes >= AFTERNOON_OPEN && currentMinutes < AFTERNOON_ORDER_CLOSE) {
    return {
      status: 'open',
      isAcceptingOrders: true,
      message: '✅ Estamos abiertos',
      subMessage: 'Horario de atención: 4:00 PM - 8:00 PM',
    };
  }

  // ----------------------------------------------------------------
  // Turno de tarde: pedidos cerrados (19:40 - 20:00)
  // ----------------------------------------------------------------
  if (currentMinutes >= AFTERNOON_ORDER_CLOSE && currentMinutes < AFTERNOON_CLOSE) {
    return {
      status: 'closed',
      isAcceptingOrders: false,
      message: '🌙 Por hoy terminamos la atención',
      subMessage: 'Ya no aceptamos más pedidos. ¡Gracias y hasta mañana a las 9:00 AM!',
    };
  }

  // Fallback (no debería llegar aquí)
  return {
    status: 'closed',
    isAcceptingOrders: false,
    message: '🌙 El restaurante está cerrado',
    subMessage: 'Volvemos mañana a las 9:00 AM.',
  };
}
