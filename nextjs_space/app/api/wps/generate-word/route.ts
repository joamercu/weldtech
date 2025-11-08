import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { wpsDataToMarkdown, formatWPSForWord, validateWPSData, type WPSData } from '@/lib/wps-converter';
import FormData from 'form-data';
import { Readable } from 'stream';

/**
 * API Route para generar documento Word desde datos WPS
 * Llama a la API Python md2word-api para generar documento con branding
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado. Inicie sesión para generar documentos.' },
        { status: 401 }
      );
    }

    // Obtener datos WPS del body
    const wpsData: WPSData = await request.json();

    // Validar datos mínimos
    const validation = validateWPSData(wpsData);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Datos WPS incompletos',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Convertir WPS a Markdown
    const markdownContent = wpsDataToMarkdown(wpsData);
    
    // Preparar metadata para el documento
    const metadata = formatWPSForWord(wpsData);

    // URL de la API Python
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000/convert';

    // Crear FormData para enviar a la API Python
    const form = new FormData();
    
    // Crear un buffer del contenido markdown
    const mdBuffer = Buffer.from(markdownContent, 'utf-8');
    
    // Agregar archivo markdown
    form.append('md_file', mdBuffer, {
      filename: `WPS-${wpsData.wpsNumber}.md`,
      contentType: 'text/markdown',
    });

    // Agregar parámetros
    form.append('brand', metadata.brand);
    form.append('title', metadata.title);
    form.append('subtitle', metadata.subtitle);
    form.append('project', metadata.project);
    form.append('client', metadata.client);
    form.append('author', metadata.author);
    form.append('version', metadata.version);

    // Realizar petición a la API Python
    console.log(`📤 Enviando petición a API Python: ${pythonApiUrl}`);
    
    const response = await fetch(pythonApiUrl, {
      method: 'POST',
      body: form as any,
      headers: form.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de API Python:', errorText);
      
      // Si la API no está disponible
      if (response.status === 500 || response.status === 503) {
        return NextResponse.json(
          { 
            error: 'API de generación de documentos no disponible',
            details: 'Asegúrese de que el servidor Python esté ejecutándose en http://localhost:8000'
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Error al generar documento',
          details: errorText
        },
        { status: response.status }
      );
    }

    // Obtener el archivo Word generado
    const wordBuffer = await response.arrayBuffer();
    
    console.log(`✅ Documento generado exitosamente: ${wordBuffer.byteLength} bytes`);

    // Retornar el archivo Word
    return new NextResponse(wordBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="WPS-${wpsData.wpsNumber}.docx"`,
      },
    });

  } catch (error) {
    console.error('❌ Error en API route generate-word:', error);
    
    // Error de conexión con la API Python
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'No se pudo conectar con la API de generación',
          details: 'Verifique que el servidor Python esté ejecutándose: npm run api:start o start_api.bat'
        },
        { status: 503 }
      );
    }

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
 * GET endpoint para verificar disponibilidad de la API
 */
export async function GET() {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000/health';
    
    const response = await fetch(pythonApiUrl, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'ok',
        message: 'API Python disponible',
        pythonApi: data
      });
    }

    return NextResponse.json(
      { 
        status: 'error',
        message: 'API Python no responde correctamente' 
      },
      { status: 503 }
    );

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'API Python no disponible',
        details: 'Inicie el servidor con: cd md2word-api && python -m api.main'
      },
      { status: 503 }
    );
  }
}

