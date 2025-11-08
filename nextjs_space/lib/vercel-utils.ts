/**
 * Utilidades para detectar el entorno de Vercel
 * 
 * Esta utilidad permite detectar si la aplicación está ejecutándose
 * en la versión gratuita de Vercel, lo cual es necesario para habilitar
 * el "Modo Desarrollo" exclusivamente en ese entorno.
 */

/**
 * Detecta si la aplicación está ejecutándose en Vercel
 * @returns true si está en Vercel, false en caso contrario
 */
export function isVercelEnvironment(): boolean {
  // Vercel establece automáticamente estas variables de entorno
  // VERCEL está presente en todos los entornos de Vercel
  // VERCEL_ENV puede ser 'production', 'preview', o 'development'
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' && 
         !!process.env.VERCEL;
}

/**
 * Detecta si estamos en la versión gratuita de Vercel
 * 
 * La versión gratuita de Vercel se identifica por:
 * - Estar en Vercel (VERCEL=true)
 * - Estar en un dominio .vercel.app (para client-side)
 * 
 * Nota: Esta función funciona tanto en el servidor como en el cliente.
 * 
 * @returns true si está en la versión gratuita de Vercel
 */
export function isVercelFreeTier(): boolean {
  // En el cliente, verificamos el dominio
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Los dominios gratuitos de Vercel terminan en .vercel.app
    // También verificamos si estamos en localhost para desarrollo
    if (hostname.includes('.vercel.app')) {
      return true;
    }
    // En desarrollo local, también permitimos el modo desarrollo
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
  }
  
  // En el servidor, verificamos las variables de entorno
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    // Si estamos en Vercel
    if (process.env.VERCEL) {
      return true;
    }
    // En desarrollo local, también permitimos el modo desarrollo
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
  }
  
  return false;
}

/**
 * Detecta si el modo desarrollo debe estar disponible
 * 
 * El modo desarrollo solo está disponible si:
 * 1. Estamos en la versión gratuita de Vercel
 * 2. El usuario NO está autenticado
 * 3. Edge Config lo permite (si está configurado)
 * 
 * @param isAuthenticated - Indica si el usuario está autenticado
 * @param edgeConfigEnabled - Indica si Edge Config permite el modo desarrollo (opcional)
 * @returns true si el modo desarrollo debe estar disponible
 */
export function isDevelopmentModeAvailable(
  isAuthenticated: boolean, 
  edgeConfigEnabled?: boolean | null
): boolean {
  // El modo desarrollo NO está disponible para usuarios autenticados
  if (isAuthenticated) {
    return false;
  }
  
  // Si Edge Config está configurado y deshabilitado, no permitir
  if (edgeConfigEnabled === false) {
    return false;
  }
  
  // Si Edge Config está habilitado explícitamente, permitir
  if (edgeConfigEnabled === true) {
    return isVercelFreeTier();
  }
  
  // Por defecto, solo disponible en la versión gratuita de Vercel
  return isVercelFreeTier();
}

