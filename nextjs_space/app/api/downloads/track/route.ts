
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { documentType, documentName, hasWatermark } = body;
    
    if (!documentType || !documentName) {
      return NextResponse.json(
        { error: 'documentType y documentName son requeridos' },
        { status: 400 }
      );
    }
    
    // Obtener información adicional
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Crear registro de descarga
    await prisma.download.create({
      data: {
        userId: session?.user ? (session.user as any).id : null,
        userEmail: session?.user?.email || null,
        documentType,
        documentName,
        hasWatermark: hasWatermark ?? !session?.user,
        ipAddress,
        userAgent,
      },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Error al registrar descarga' },
      { status: 500 }
    );
  }
}
