'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useDevelopmentMode } from '@/hooks/use-development-mode';

/**
 * Contexto para el Modo Desarrollo
 * 
 * Este contexto proporciona el estado del modo desarrollo a todos
 * los componentes de la aplicación, permitiendo que cualquier
 * componente verifique si el modo desarrollo está activo.
 */
interface DevelopmentModeContextType {
  isDevelopmentMode: boolean;
  isAvailable: boolean;
  activateDevelopmentMode: () => boolean;
  deactivateDevelopmentMode: () => void;
  toggleDevelopmentMode: () => void;
}

const DevelopmentModeContext = createContext<DevelopmentModeContextType | undefined>(undefined);

/**
 * Provider del contexto de Modo Desarrollo
 * 
 * Este provider debe envolver la aplicación para que todos los
 * componentes puedan acceder al estado del modo desarrollo.
 */
export function DevelopmentModeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const developmentMode = useDevelopmentMode(isAuthenticated);

  return (
    <DevelopmentModeContext.Provider value={developmentMode}>
      {children}
    </DevelopmentModeContext.Provider>
  );
}

/**
 * Hook para usar el contexto de Modo Desarrollo
 * 
 * @returns El contexto de modo desarrollo
 * @throws Error si se usa fuera del DevelopmentModeProvider
 */
export function useDevelopmentModeContext(): DevelopmentModeContextType {
  const context = useContext(DevelopmentModeContext);
  
  if (context === undefined) {
    throw new Error('useDevelopmentModeContext debe usarse dentro de un DevelopmentModeProvider');
  }
  
  return context;
}

