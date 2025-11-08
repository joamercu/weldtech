import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateServiceGuidePDF } from '@/lib/pdf/pdf-builder';
import { trackDownload } from '@/lib/watermark';

export const dynamic = 'force-dynamic';

/**
 * API Route para generar y descargar la Guía de Servicio en PDF
 * Solo disponible para usuarios autenticados
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes estar autenticado para descargar la guía' },
        { status: 401 }
      );
    }

    // 2. Generar PDF con información del usuario
    const pdfBuffer = await generateServiceGuidePDF({
      userId: (session.user as any).id || session.user.email || 'unknown',
      userName: session.user.name || null,
      userEmail: session.user.email || null,
    });

    // 3. Tracking de descarga
    try {
      await trackDownload({
        documentType: 'guia-servicio',
        documentName: 'Guia_Integral_Servicios_WeldTech.pdf',
        userId: (session.user as any).id || undefined,
        userEmail: session.user.email || undefined,
        hasWatermark: false, // Usuarios registrados no tienen marca de agua
      });
    } catch (trackError) {
      console.error('Error tracking download:', trackError);
      // No fallar la descarga si el tracking falla
    }

    // 4. Retornar PDF
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Guia_Integral_Servicios_WeldTech_${timestamp}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    // Crear respuesta con headers que fuerzan la descarga sin pedir permisos
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json(
      { 
        error: 'Error al generar el PDF',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

