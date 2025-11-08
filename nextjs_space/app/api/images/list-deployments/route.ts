import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * API Route para listar deployments de Abacus.AI
 * Permite obtener el deploymentId necesario para generar imágenes
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

    // Obtener projectId del query string (opcional)
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // URL de la API de Abacus.AI para listar deployments
    // Según documentación: requiere projectId como query parameter
    const possibleEndpoints = projectId 
      ? [
          `https://api.abacus.ai/api/v0/listDeployments?projectId=${projectId}`,
          `https://api.abacus.ai/api/v0/deployments?projectId=${projectId}`,
          `https://api.abacus.ai/api/v0/listDeployments?projectId=${projectId}&apiKey=${abacusApiKey}`
        ]
      : [
          'https://api.abacus.ai/api/v0/listDeployments',
          'https://api.abacus.ai/api/v0/deployments',
          'https://api.abacus.ai/v1/deployments'
        ];

    console.log('🔍 Listando deployments de Abacus.AI...');
    console.log(`API Key: ${abacusApiKey.substring(0, 10)}...`);
    console.log(`Project ID: ${projectId || 'No proporcionado (puede ser requerido)'}`);
    console.log(`Probando ${possibleEndpoints.length} endpoints...`);

    // Realizar petición a la API de Abacus.AI
    const startTime = Date.now();
    let lastError: any = null;
    let successfulResponse: any = null;
    let workingEndpoint: string | null = null;
    
    // Usar header apiKey según documentación oficial
    for (let i = 0; i < possibleEndpoints.length; i++) {
      const deploymentsUrl = possibleEndpoints[i];
      console.log(`Probando endpoint ${i + 1}/${possibleEndpoints.length}: ${deploymentsUrl}`);
      
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'apiKey': abacusApiKey // Según documentación oficial
        };

        const response = await fetch(deploymentsUrl, {
          method: 'GET',
          headers,
          // Timeout de 10 segundos
          signal: AbortSignal.timeout(10000)
        });

        // Verificar si es una página HTML (404)
        const responseText = await response.text();
        
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          console.log(`❌ Endpoint ${deploymentsUrl} retorna 404 (HTML)`);
          lastError = {
            endpoint: deploymentsUrl,
            error: 'Endpoint no encontrado (404)',
            status: 404
          };
          continue;
        }
        
        if (!response.ok) {
          console.log(`❌ Endpoint ${deploymentsUrl} falló: ${response.status}`);
          lastError = {
            endpoint: deploymentsUrl,
            error: responseText.substring(0, 200),
            status: response.status
          };
          continue;
        }

        // Intentar parsear como JSON
        let result: any;
        try {
          result = JSON.parse(responseText);
        } catch (error) {
          console.log(`❌ Respuesta no es JSON válido`);
          lastError = {
            endpoint: deploymentsUrl,
            error: 'Respuesta no es JSON válido',
            status: response.status
          };
          continue;
        }
        
        const responseTime = Date.now() - startTime;
        console.log(`✅ Deployments listados exitosamente con endpoint: ${deploymentsUrl}`);
        console.log(`Tiempo de respuesta: ${responseTime}ms`);
        console.log(`Total de deployments: ${Array.isArray(result) ? result.length : result.deployments?.length || 0}`);
        
        successfulResponse = result;
        workingEndpoint = deploymentsUrl;
        break;
      } catch (error: any) {
        console.log(`❌ Error con endpoint ${deploymentsUrl}:`, error.message);
        lastError = {
          endpoint: deploymentsUrl,
          error: error.message
        };
        continue;
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    // Si alguna configuración funcionó
    if (successfulResponse) {
      return NextResponse.json({
        success: true,
        message: 'Deployments listados exitosamente',
        responseTime: `${responseTime}ms`,
        deployments: Array.isArray(successfulResponse) ? successfulResponse : successfulResponse.deployments || [],
        total: Array.isArray(successfulResponse) ? successfulResponse.length : successfulResponse.deployments?.length || 0,
        config: {
          hasApiKey: true,
          apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
          endpoint: workingEndpoint
        }
      });
    }
    
    // Si todas las configuraciones fallaron
    return NextResponse.json({
      success: false,
      error: 'Error al listar deployments de Abacus.AI',
      details: lastError?.error || 'No se pudo conectar con ningún endpoint',
      status: lastError?.status || 404,
      responseTime: `${responseTime}ms`,
      config: {
        hasApiKey: true,
        apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
        testedEndpoints: possibleEndpoints
      },
      lastError: lastError,
      solution: {
        required: projectId ? 'El endpoint puede requerir configuración adicional' : 'Project ID es requerido para listar deployments',
        suggestion: projectId 
          ? 'El endpoint para listar deployments puede no estar disponible públicamente. Puedes obtener el deploymentId desde el Dashboard de Abacus.AI.'
          : 'Primero debes listar proyectos para obtener el projectId. Luego usa ese projectId para listar deployments.',
        steps: projectId 
          ? [
              '1. Acceder al Dashboard de Abacus.AI: https://abacus.ai/',
              '2. Iniciar sesión con tu cuenta',
              '3. Navegar a la sección "Deployments" o "Deployments"',
              '4. Ver lista de deployments existentes',
              '5. Seleccionar el deployment de generación de imágenes',
              '6. Copiar el deploymentId',
              '7. Agregar a .env.local: ABACUS_DEPLOYMENT_ID=tu_deployment_id',
              '8. Reiniciar el servidor Next.js'
            ]
          : [
              '1. Primero listar proyectos usando: GET /api/images/list-projects',
              '2. Obtener el projectId de la respuesta',
              '3. Usar ese projectId para listar deployments: GET /api/images/list-deployments?projectId=TU_PROJECT_ID',
              '4. O usar el componente "Listar Proyectos" en la página de administración'
            ],
        alternative: 'O obtener el deploymentId directamente desde el Dashboard de Abacus.AI'
      }
    }, { status: lastError?.status || 404 });

  } catch (error) {
    console.error('❌ Error en list-deployments:', error);
    
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
