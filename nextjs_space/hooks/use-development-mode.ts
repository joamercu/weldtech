'use client';

import { useState, useEffect, useCallback } from 'react';
import { isDevelopmentModeAvailable } from '@/lib/vercel-utils';

/**
 * Hook personalizado para gestionar el estado del "Modo Desarrollo"
 * 
 * El Modo Desarrollo permite a usuarios no registrados desbloquear
 * todas las funcionalidades disponibles para personal registrado,
 * pero solo está disponible en la versión gratuita de Vercel.
 * 
 * @param isAuthenticated - Indica si el usuario está autenticado
 * @returns Objeto con el estado y funciones para gestionar el modo desarrollo
 */
export function useDevelopmentMode(isAuthenticated: boolean) {
  // Clave para almacenar el estado en localStorage
  const STORAGE_KEY = 'weldtech_development_mode';
  
  // Estado para Edge Config
  const [edgeConfigEnabled, setEdgeConfigEnabled] = useState<boolean | null>(null);
  
  // Estado inicial: lee desde localStorage o false por defecto
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch (error) {
      console.error('Error al leer el modo desarrollo desde localStorage:', error);
      return false;
    }
  });

  // Consultar Edge Config al montar el componente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkEdgeConfig = async () => {
      try {
        const hostname = window.location.hostname;
        const response = await fetch(`/api/edge-config?key=developmentMode&hostname=${encodeURIComponent(hostname)}`);
        
        if (response.ok) {
          const data = await response.json();
          setEdgeConfigEnabled(data.enabled === true);
        } else {
          // Si Edge Config no está disponible, usar comportamiento por defecto
          setEdgeConfigEnabled(null);
        }
      } catch (error) {
        console.error('Error al consultar Edge Config:', error);
        // Si hay error, usar comportamiento por defecto
        setEdgeConfigEnabled(null);
      }
    };

    checkEdgeConfig();
  }, []);

  // Verificar si el modo desarrollo está disponible
  const isAvailable = isDevelopmentModeAvailable(isAuthenticated, edgeConfigEnabled);

  // Efecto para sincronizar con localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (isDevelopmentMode) {
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error al guardar el modo desarrollo en localStorage:', error);
    }
  }, [isDevelopmentMode]);

  // Efecto para desactivar el modo desarrollo si el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && isDevelopmentMode) {
      setIsDevelopmentMode(false);
    }
  }, [isAuthenticated, isDevelopmentMode]);

  // Función para activar el modo desarrollo
  const activateDevelopmentMode = useCallback(() => {
    if (!isAvailable) {
      console.warn('El modo desarrollo no está disponible');
      return false;
    }

    if (isAuthenticated) {
      console.warn('El modo desarrollo no está disponible para usuarios autenticados');
      return false;
    }

    setIsDevelopmentMode(true);
    return true;
  }, [isAvailable, isAuthenticated]);

  // Función para desactivar el modo desarrollo
  const deactivateDevelopmentMode = useCallback(() => {
    setIsDevelopmentMode(false);
  }, []);

  // Función para alternar el modo desarrollo
  const toggleDevelopmentMode = useCallback(() => {
    if (isDevelopmentMode) {
      deactivateDevelopmentMode();
    } else {
      activateDevelopmentMode();
    }
  }, [isDevelopmentMode, activateDevelopmentMode, deactivateDevelopmentMode]);

  return {
    isDevelopmentMode,
    isAvailable,
    activateDevelopmentMode,
    deactivateDevelopmentMode,
    toggleDevelopmentMode,
  };
}

