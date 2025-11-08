import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * API Route para obtener endpoints específicos de la organización
 * Puede devolver URIs específicos para tu org/región
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Obtener API key de Abacus.AI
    const abacusApiKey = process.env.ABACUS_API_KEY;
    
    if (!abacusApiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key no configurada',
        details: 'La variable ABACUS_API_KEY no está configurada en .env.local',
        config: {
          hasApiKey: false
        }
      }, { status: 500 });
    }

    // URL de la API de Abacus.AI para obtener endpoints
    const endpointUrl = 'https://api.abacus.ai/api/v0/getApiEndpoint';

    console.log('🔍 Obteniendo endpoints de API de Abacus.AI...');
    console.log(`API Key: ${abacusApiKey.substring(0, 10)}...`);
    console.log(`Endpoint: ${endpointUrl}`);

    // Realizar petición a la API de Abacus.AI
    const startTime = Date.now();
    
    try {
      // Usar header apiKey según documentación
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apiKey': abacusApiKey
      };

      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers,
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000)
      });

      const responseTime = Date.now() - startTime;
      const responseText = await response.text();

      // Verificar si es una página HTML (404)
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        console.error('❌ Endpoint retorna 404 (HTML)');
        return NextResponse.json({
          success: false,
          error: 'Endpoint no encontrado (404)',
          details: 'El endpoint getApiEndpoint no existe o no está disponible',
          status: 404,
          responseTime: `${responseTime}ms`,
          config: {
            hasApiKey: true,
            apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
            endpoint: endpointUrl
          }
        }, { status: 404 });
      }

      if (!response.ok) {
        console.error('❌ Error al obtener endpoints:', responseText);
        
        return NextResponse.json({
          success: false,
          error: 'Error al obtener endpoints de API',
          details: responseText.substring(0, 500) || `Status: ${response.status}`,
          status: response.status,
          responseTime: `${responseTime}ms`,
          config: {
            hasApiKey: true,
            apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
            endpoint: endpointUrl
          }
        }, { status: response.status });
      }

      // Intentar parsear como JSON
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Respuesta no es JSON válido',
          details: responseText.substring(0, 200),
          status: response.status,
          responseTime: `${responseTime}ms`
        }, { status: 500 });
      }
      
      console.log('✅ Endpoints obtenidos exitosamente');
      console.log(`Tiempo de respuesta: ${responseTime}ms`);

      return NextResponse.json({
        success: true,
        message: 'Endpoints obtenidos exitosamente',
        responseTime: `${responseTime}ms`,
        endpoints: result,
        config: {
          hasApiKey: true,
          apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
          endpoint: endpointUrl
        }
      });

    } catch (fetchError: any) {
      const responseTime = Date.now() - startTime;
      
      console.error('❌ Error de conexión:', fetchError);
      
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        return NextResponse.json({
          success: false,
          error: 'Timeout al conectar con Abacus.AI',
          details: 'La API no respondió en 10 segundos',
          responseTime: `${responseTime}ms`,
          config: {
            hasApiKey: true,
            apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
            endpoint: endpointUrl
          }
        }, { status: 504 });
      }

      return NextResponse.json({
        success: false,
        error: 'Error al conectar con Abacus.AI',
        details: fetchError.message || 'Error desconocido',
        responseTime: `${responseTime}ms`,
        config: {
          hasApiKey: true,
          apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
          endpoint: endpointUrl
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error en get-api-endpoint:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

