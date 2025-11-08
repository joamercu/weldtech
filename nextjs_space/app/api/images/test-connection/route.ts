import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * API Route para probar la conexión con Abacus.AI
 * Verifica que la API key sea válida y que la conexión funcione
 * Prueba múltiples configuraciones automáticamente
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
          hasApiKey: false,
          hasDeploymentId: !!process.env.ABACUS_DEPLOYMENT_ID
        }
      }, { status: 500 });
    }

    // Verificar formato de API key
    const apiKeyFormat = abacusApiKey.startsWith('s2_') ? 'correcto' : 'posiblemente incorrecto';
    
    // URL de la API de Abacus.AI para prueba
    const abacusApiUrl = 'https://api.abacus.ai/api/v0/generateImage';
    
    // Crear un prompt de prueba simple
    const testPrompt = 'Test connection - simple technical diagram';
    
    // Preparar datos para la prueba
    const deploymentId = process.env.ABACUS_DEPLOYMENT_ID;
    
    // La API requiere deploymentId según el error recibido
    // Probar diferentes configuraciones
    const testConfigurations = [];
    
    // Configuración 1: Con deploymentId si está configurado
    if (deploymentId) {
      testConfigurations.push({
        name: 'Con Deployment ID',
        requestData: {
          deploymentId: deploymentId,
          deploymentToken: abacusApiKey,
          prompt: testPrompt
        }
      });
    }
    
    // Configuración 2: Solo con deploymentToken (puede fallar pero lo probamos)
    testConfigurations.push({
      name: 'Solo con Deployment Token',
      requestData: {
        deploymentToken: abacusApiKey,
        prompt: testPrompt
      }
    });
    
    // Configuración 3: Con queryData
    testConfigurations.push({
      name: 'Con queryData',
      requestData: {
        deploymentToken: abacusApiKey,
        queryData: { prompt: testPrompt }
      }
    });
    
    if (deploymentId) {
      testConfigurations.push({
        name: 'Con Deployment ID y queryData',
        requestData: {
          deploymentId: deploymentId,
          deploymentToken: abacusApiKey,
          queryData: { prompt: testPrompt }
        }
      });
    }

    console.log('🔍 Probando conexión con Abacus.AI...');
    console.log(`API Key: ${abacusApiKey.substring(0, 10)}...`);
    console.log(`Formato: ${apiKeyFormat}`);
    console.log(`Deployment ID: ${deploymentId || 'No configurado (requerido)'}`);
    console.log(`Endpoint: ${abacusApiUrl}`);
    console.log(`Probando ${testConfigurations.length} configuraciones...`);

    // Realizar petición de prueba a la API de Abacus.AI
    const startTime = Date.now();
    let lastError: any = null;
    let successfulConfig: any = null;
    
    for (let i = 0; i < testConfigurations.length; i++) {
      const config = testConfigurations[i];
      console.log(`Probando configuración ${i + 1}/${testConfigurations.length}: ${config.name}`);
      
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        const response = await fetch(abacusApiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(config.requestData),
          // Timeout de 10 segundos para la prueba
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const result = await response.json();
          const responseTime = Date.now() - startTime;
          console.log(`✅ Conexión exitosa con configuración: ${config.name}`);
          console.log(`Tiempo de respuesta: ${responseTime}ms`);
          
          successfulConfig = {
            name: config.name,
            requestData: config.requestData,
            response: result
          };
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ Configuración ${config.name} falló: ${errorText.substring(0, 200)}`);
          lastError = {
            config: config.name,
            error: errorText,
            status: response.status
          };
        }
      } catch (error: any) {
        console.log(`❌ Error con configuración ${config.name}:`, error.message);
        lastError = {
          config: config.name,
          error: error.message
        };
        continue;
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    // Si alguna configuración funcionó
    if (successfulConfig) {
      return NextResponse.json({
        success: true,
        message: `Conexión exitosa con Abacus.AI usando: ${successfulConfig.name}`,
        responseTime: `${responseTime}ms`,
        config: {
          hasApiKey: true,
          apiKeyFormat,
          hasDeploymentId: !!deploymentId,
          apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
          endpoint: abacusApiUrl,
          workingConfiguration: successfulConfig.name
        },
        testResult: {
          successfulConfig: successfulConfig.name,
          requestData: successfulConfig.requestData
        }
      });
    }
    
    // Si todas las configuraciones fallaron
    const errorDetails = lastError?.error || 'Error desconocido';
    const errorText = typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails);
    const isMissingDeploymentId = errorText.includes('deploymentId') || 
                                   errorText.includes('Missing required parameter');
    
    return NextResponse.json({
      success: false,
      error: 'Error al conectar con Abacus.AI',
      details: errorText,
      status: lastError?.status || 400,
      responseTime: `${responseTime}ms`,
      config: {
        hasApiKey: true,
        apiKeyFormat,
        hasDeploymentId: !!deploymentId,
        apiKeyPrefix: abacusApiKey.substring(0, 10) + '...',
        endpoint: abacusApiUrl
      },
      testedConfigurations: testConfigurations.map(c => c.name),
      lastError: lastError,
      solution: isMissingDeploymentId ? {
        required: 'Deployment ID es requerido',
        steps: [
          '1. Acceder al Dashboard de Abacus.AI: https://abacus.ai/',
          '2. Navegar a la sección "Deployments"',
          '3. Seleccionar o crear un deployment para generación de imágenes',
          '4. Copiar el deploymentId',
          '5. Agregar a .env.local: ABACUS_DEPLOYMENT_ID=tu_deployment_id',
          '6. Reiniciar el servidor Next.js'
        ],
        alternative: 'O contactar soporte de Abacus.AI para obtener el deploymentId correcto'
      } : {
        suggestion: 'Revisar la documentación oficial de Abacus.AI o contactar soporte'
      }
    }, { status: lastError?.status || 400 });

  } catch (error) {
    console.error('❌ Error en test-connection:', error);
    
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
