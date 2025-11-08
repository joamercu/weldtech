import { NextRequest, NextResponse } from 'next/server';
import { getEdgeConfig, isDevelopmentModeEnabledInEdgeConfig, isDomainAllowedForDevelopmentMode } from '@/lib/edge-config';

/**
 * API Route para consultar Edge Config de forma segura
 * 
 * Esta ruta permite al cliente consultar la configuración de Edge Config
 * sin exponer el token directamente.
 * 
 * GET /api/edge-config?key=developmentMode
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    const hostname = searchParams.get('hostname') || 
                     request.headers.get('host') || 
                     '';

    // Si se solicita específicamente el modo desarrollo
    if (key === 'developmentMode') {
      const enabled = await isDevelopmentModeEnabledInEdgeConfig();
      const domainAllowed = await isDomainAllowedForDevelopmentMode(hostname);
      
      return NextResponse.json({
        enabled: enabled && domainAllowed,
        domainAllowed,
        hostname,
      });
    }

    // Obtener configuración general
    const config = await getEdgeConfig(key || undefined);

    if (!config) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('[API Edge Config] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

