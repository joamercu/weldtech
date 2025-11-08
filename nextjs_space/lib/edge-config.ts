/**
 * Utilidades para acceder a Edge Config de Vercel
 * 
 * Edge Config permite almacenar configuración global de baja latencia
 * que se puede actualizar sin necesidad de redeploy.
 * 
 * Documentación: https://vercel.com/docs/storage/edge-config
 */

/**
 * Interfaz para la configuración almacenada en Edge Config
 */
export interface EdgeConfigData {
  // Configuración del Modo Desarrollo
  developmentMode?: {
    enabled: boolean;
    allowedDomains?: string[];
    message?: string;
  };
  
  // Configuración general de la aplicación
  app?: {
    greeting?: string;
    maintenance?: boolean;
    features?: {
      [key: string]: boolean;
    };
  };
  
  // Otros datos de configuración
  [key: string]: any;
}

/**
 * Obtiene la configuración desde Edge Config
 * 
 * @param key - Clave específica a obtener (opcional, si no se proporciona retorna todo)
 * @returns La configuración solicitada o null si hay error
 */
export async function getEdgeConfig(key?: string): Promise<EdgeConfigData | any | null> {
  try {
    // URL de Edge Config desde variables de entorno
    // Formato esperado: https://edge-config.vercel.com/ecfg_xxxxx
    const edgeConfigUrl = process.env.EDGE_CONFIG;
    
    if (!edgeConfigUrl) {
      console.warn('[Edge Config] EDGE_CONFIG no está configurado');
      return null;
    }

    // Token de Edge Config
    const token = process.env.EDGE_CONFIG_TOKEN;
    
    if (!token) {
      console.warn('[Edge Config] EDGE_CONFIG_TOKEN no está configurado');
      return null;
    }

    // Construir URL completa
    // Edge Config API: https://edge-config.vercel.com/{edgeConfigId}?token={token}
    const baseUrl = edgeConfigUrl.replace(/\/$/, ''); // Remover trailing slash si existe
    const url = `${baseUrl}${key ? `/${key}` : ''}?token=${token}`;

    const response = await fetch(url, {
      // Cache por 60 segundos para reducir llamadas
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[Edge Config] Error al obtener configuración: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Edge Config retorna { items: {...} } cuando se consulta sin key
    // O directamente el valor cuando se consulta con key
    if (key) {
      // Si se especifica una key, retornar el valor directamente
      return data;
    } else {
      // Si no se especifica key, retornar items
      return data.items || data;
    }
  } catch (error) {
    console.error('[Edge Config] Error al obtener configuración:', error);
    return null;
  }
}

/**
 * Verifica si el Modo Desarrollo está habilitado en Edge Config
 * 
 * @returns true si está habilitado, false en caso contrario
 */
export async function isDevelopmentModeEnabledInEdgeConfig(): Promise<boolean> {
  try {
    const config = await getEdgeConfig('developmentMode');
    
    if (!config) {
      return false;
    }
    
    return config.enabled === true;
  } catch (error) {
    console.error('[Edge Config] Error al verificar Modo Desarrollo:', error);
    return false;
  }
}

/**
 * Verifica si el dominio actual está permitido para el Modo Desarrollo
 * 
 * @param hostname - Hostname actual
 * @returns true si el dominio está permitido
 */
export async function isDomainAllowedForDevelopmentMode(hostname: string): Promise<boolean> {
  try {
    const config = await getEdgeConfig('developmentMode');
    
    if (!config || !config.allowedDomains) {
      // Si no hay configuración, permitir dominios .vercel.app por defecto
      return hostname.includes('.vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
    }
    
    // Verificar si el hostname está en la lista de dominios permitidos
    return config.allowedDomains.some((domain: string) => 
      hostname.includes(domain) || hostname === domain
    );
  } catch (error) {
    console.error('[Edge Config] Error al verificar dominio permitido:', error);
    // Por defecto, permitir dominios .vercel.app
    return hostname.includes('.vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
  }
}

/**
 * Obtiene el mensaje personalizado del Modo Desarrollo desde Edge Config
 * 
 * @returns El mensaje o null si no está configurado
 */
export async function getDevelopmentModeMessage(): Promise<string | null> {
  try {
    const config = await getEdgeConfig('developmentMode');
    return config?.message || null;
  } catch (error) {
    console.error('[Edge Config] Error al obtener mensaje:', error);
    return null;
  }
}

/**
 * Verifica si una feature está habilitada en Edge Config
 * 
 * @param featureName - Nombre de la feature
 * @returns true si está habilitada, false en caso contrario
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const config = await getEdgeConfig('app');
    
    if (!config || !config.features) {
      return false;
    }
    
    return config.features[featureName] === true;
  } catch (error) {
    console.error(`[Edge Config] Error al verificar feature ${featureName}:`, error);
    return false;
  }
}

/**
 * Obtiene el saludo personalizado desde Edge Config
 * 
 * @returns El saludo o null si no está configurado
 */
export async function getGreeting(): Promise<string | null> {
  try {
    const config = await getEdgeConfig('app');
    return config?.greeting || null;
  } catch (error) {
    console.error('[Edge Config] Error al obtener saludo:', error);
    return null;
  }
}

