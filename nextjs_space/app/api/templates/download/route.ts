import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  templateExists,
  previewExists,
  readTemplate,
  readPreview,
  getTemplateInfo,
} from '@/lib/excel-handler';
import { trackDownload } from '@/lib/watermark';

/**
 * API Route para descargar plantillas
 * 
 * GET /api/templates/download?id=wps
 * 
 * - Usuarios NO registrados: Retorna PDF con marca de agua
 * - Usuarios registrados: Retorna Excel sin marca de agua
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID es requerido' },
        { status: 400 }
      );
    }

    // Obtener sesión del usuario
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    // Obtener información del template
    const templateInfo = getTemplateInfo(templateId);
    if (!templateInfo) {
      return NextResponse.json(
        { error: 'Template no encontrado' },
        { status: 404 }
      );
    }

    let fileBuffer: Buffer;
    let fileName: string;
    let contentType: string;
    let hasWatermark: boolean;

    if (isAuthenticated) {
      // Usuario registrado → Servir Excel SIN marca de agua
      if (!templateExists(templateId)) {
        return NextResponse.json(
          { 
            error: 'Archivo Excel no disponible aún. Estamos trabajando en ello.',
            templateId,
            available: false
          },
          { status: 404 }
        );
      }

      fileBuffer = readTemplate(templateId);
      fileName = templateInfo.fileName;
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      hasWatermark = false;

      // Registrar descarga
      await trackDownload({
        documentType: 'template',
        documentName: templateInfo.name,
        hasWatermark: false,
        userId: (session.user as any)?.id || session.user?.email,
        userEmail: session.user?.email || undefined,
      });
    } else {
      // Usuario NO registrado → Servir PDF CON marca de agua
      if (!previewExists(templateId)) {
        return NextResponse.json(
          { 
            error: 'Preview PDF no disponible aún. Estamos trabajando en ello.',
            templateId,
            available: false
          },
          { status: 404 }
        );
      }

      fileBuffer = readPreview(templateId);
      fileName = templateInfo.fileName.replace('.xlsx', '_Preview_public.pdf');
      contentType = 'application/pdf';
      hasWatermark = true;

      // Registrar descarga
      await trackDownload({
        documentType: 'template',
        documentName: templateInfo.name,
        hasWatermark: true,
      });
    }

    // Crear respuesta con el archivo
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error en descarga de template:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

