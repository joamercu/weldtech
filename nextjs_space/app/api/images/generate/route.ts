import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * API Route para generar imágenes usando Abacus.AI
 * Integra con la API de Abacus.AI para generar imágenes basadas en prompts
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado. Inicie sesión para generar imágenes.' },
        { status: 401 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const { prompt, style, data, deploymentId } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'El prompt es requerido' },
        { status: 400 }
      );
    }

    // Construir prompt completo con estilo de marca WeldTech
    const fullPrompt = buildWeldTechPrompt(prompt, style, data);

    // Obtener API key de Abacus.AI
    const abacusApiKey = process.env.ABACUS_API_KEY;
    if (!abacusApiKey) {
      return NextResponse.json(
        { 
          error: 'API key de Abacus.AI no configurada',
          details: 'Configure ABACUS_API_KEY en las variables de entorno'
        },
        { status: 500 }
      );
    }

    // Obtener deploymentId (puede venir del body o de env)
    const deploymentIdToUse = deploymentId || process.env.ABACUS_DEPLOYMENT_ID;
    
    // URL de la API de Abacus.AI para generación de imágenes
    const abacusApiUrl = 'https://api.abacus.ai/api/v0/generateImage';

    // Preparar datos para la API de Abacus.AI
    // La API requiere deploymentToken y deploymentId según los errores recibidos
    const requestData: any = {
      deploymentToken: abacusApiKey,
      prompt: fullPrompt
    };

    // Si hay deploymentId, agregarlo
    if (deploymentIdToUse) {
      requestData.deploymentId = deploymentIdToUse;
    }

    // Headers para la petición
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    console.log(`📤 Generando imagen con Abacus.AI...`);
    console.log(`Prompt: ${fullPrompt.substring(0, 100)}...`);
    console.log(`Endpoint: ${abacusApiUrl}`);

    // Realizar petición a la API de Abacus.AI
    const response = await fetch(abacusApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de API Abacus.AI:', errorText);
      
      // Verificar si es una página HTML (404)
      if (errorText.includes('<!doctype html>') || errorText.includes('<html') || response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Endpoint de Abacus.AI no encontrado (404)',
            details: `El endpoint ${abacusApiUrl} no existe. Es posible que Abacus.AI use un endpoint diferente o requiera configuración adicional.`,
            suggestion: 'Verifica la documentación oficial de Abacus.AI para el endpoint correcto de generación de imágenes.',
            triedEndpoint: abacusApiUrl,
            status: 404
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Error al generar imagen con Abacus.AI',
          details: errorText.substring(0, 500) || `Status: ${response.status}`,
          endpoint: abacusApiUrl,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Verificar si la respuesta es JSON
    let result: any;
    try {
      result = await response.json();
    } catch (error) {
      // Si no es JSON, puede ser HTML o texto plano
      const text = await response.text();
      return NextResponse.json(
        { 
          error: 'Respuesta inesperada de Abacus.AI',
          details: 'La API retornó una respuesta que no es JSON. Puede ser que el endpoint sea incorrecto.',
          responsePreview: text.substring(0, 200),
          endpoint: abacusApiUrl
        },
        { status: 500 }
      );
    }
    
    // Verificar si la respuesta es exitosa
    if (result.success === false) {
      return NextResponse.json(
        { 
          error: 'Error en la generación de la imagen',
          details: result.error || result.message || 'Error desconocido'
        },
        { status: 400 }
      );
    }

    // La imagen puede venir en diferentes formatos según la API
    // Puede ser una URL, base64, o datos binarios
    // Abacus.AI puede retornar la imagen en diferentes estructuras
    let imageData: string;
    
    if (result.data) {
      // Si hay un campo data, puede ser un objeto con url o la imagen directamente
      if (typeof result.data === 'string') {
        imageData = result.data;
      } else if (result.data.url) {
        imageData = result.data.url;
      } else if (result.data.imageUrl) {
        imageData = result.data.imageUrl;
      } else {
        imageData = result.data;
      }
    } else if (result.imageUrl) {
      imageData = result.imageUrl;
    } else if (result.url) {
      imageData = result.url;
    } else if (typeof result === 'string') {
      imageData = result;
    } else {
      // Si no hay formato reconocido, retornar error
      console.error('Formato de respuesta no reconocido:', result);
      return NextResponse.json(
        { 
          error: 'Formato de respuesta de API no reconocido',
          details: 'La API retornó un formato inesperado'
        },
        { status: 500 }
      );
    }

    console.log(`✅ Imagen generada exitosamente`);

    return NextResponse.json({
      success: true,
      imageUrl: imageData,
      prompt: fullPrompt,
      metadata: {
        generatedAt: new Date().toISOString(),
        userId: (session.user as any)?.id || session.user?.email,
      }
    });

  } catch (error) {
    console.error('❌ Error en API route generate-image:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Construye un prompt completo con el estilo de marca WeldTech
 */
function buildWeldTechPrompt(
  userPrompt: string, 
  style?: string, 
  data?: any
): string {
  // Prompt base de estilo de marca WeldTech
  const baseStyle = `Style: Industrial technical photography, dramatic lighting, 
blue and orange color grading, high contrast, professional,
dark moody atmosphere, cinematic look, shallow depth of field

Technical elements: Welding equipment, metal surfaces, 
sparks, protective gear, blueprints, technical drawings

Color palette: Dark steel background (#0F1216), 
orange accents (#FF7A00), blue highlights (#2AA1FF)

Mood: Elite craftsmanship, precision, technical excellence,
modern industrial, professional workshop environment`;

  // Incorporar datos de entrada si existen (ej: datos WPS)
  let dataContext = '';
  if (data) {
    if (typeof data === 'object') {
      // Si hay datos WPS, crear contexto relevante
      if (data.wpsNumber) {
        dataContext = `\n\nContext: WPS ${data.wpsNumber}, ${data.company || ''}, ${data.process || ''}`;
      } else {
        dataContext = `\n\nContext: ${JSON.stringify(data)}`;
      }
    } else {
      dataContext = `\n\nContext: ${data}`;
    }
  }

  // Estilo específico si se proporciona
  const styleContext = style ? `\n\nStyle variant: ${style}` : '';

  // Construir prompt final
  return `${userPrompt}\n\n${baseStyle}${styleContext}${dataContext}`;
}

/**
 * GET endpoint para verificar disponibilidad de la API
 */
export async function GET() {
  try {
    const abacusApiKey = process.env.ABACUS_API_KEY;
    
    if (!abacusApiKey) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'API key de Abacus.AI no configurada' 
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'API de Abacus.AI configurada',
      hasApiKey: !!abacusApiKey,
      hasDeploymentId: !!process.env.ABACUS_DEPLOYMENT_ID
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Error al verificar configuración',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

