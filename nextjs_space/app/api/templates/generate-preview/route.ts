import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para generar previews de plantillas
 * Esta ruta está reservada para futuras implementaciones
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Esta funcionalidad no está disponible actualmente',
      message: 'Los previews se generan automáticamente. Usa /api/templates/download para descargar plantillas.'
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Esta funcionalidad no está disponible actualmente',
      message: 'Los previews se generan automáticamente. Usa /api/templates/download para descargar plantillas.'
    },
    { status: 501 }
  );
}

