import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as fs from 'fs';
import * as path from 'path';

/**
 * API Route para verificar el estado de generación de imágenes
 * Verifica qué imágenes han sido generadas y cuáles faltan
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

    const defects = [
      'porosidad',
      'grietas',
      'undercut',
      'escoria',
      'salpicaduras',
      'sobreposicion'
    ];

    const basePath = path.join(process.cwd(), 'public', 'herramientas', 'generated', 'abacus-ai');
    const status: Record<string, {
      defectId: string;
      defectName: string;
      hasMain: boolean;
      hasCrossSection: boolean;
      hasSurfaceView: boolean;
      mainPath?: string;
      crossSectionPath?: string;
      surfaceViewPath?: string;
      lastModified?: string;
    }> = {};

    const defectNames: Record<string, string> = {
      porosidad: 'Porosidad',
      grietas: 'Grietas',
      undercut: 'Socavado (Undercut)',
      escoria: 'Inclusiones de Escoria',
      salpicaduras: 'Salpicaduras',
      sobreposicion: 'Sobreposición (Overlap)'
    };

    for (const defectId of defects) {
      const defectPath = path.join(basePath, defectId);
      const mainPath = path.join(defectPath, 'main.jpg');
      const crossSectionPath = path.join(defectPath, 'cross-section.jpg');
      const surfaceViewPath = path.join(defectPath, 'surface-view.jpg');

      const hasMain = fs.existsSync(mainPath);
      const hasCrossSection = fs.existsSync(crossSectionPath);
      const hasSurfaceView = fs.existsSync(surfaceViewPath);

      let lastModified: string | undefined;
      if (hasMain) {
        const stats = fs.statSync(mainPath);
        lastModified = stats.mtime.toISOString();
      }

      status[defectId] = {
        defectId,
        defectName: defectNames[defectId],
        hasMain,
        hasCrossSection,
        hasSurfaceView,
        mainPath: hasMain ? `/herramientas/generated/abacus-ai/${defectId}/main.jpg` : undefined,
        crossSectionPath: hasCrossSection ? `/herramientas/generated/abacus-ai/${defectId}/cross-section.jpg` : undefined,
        surfaceViewPath: hasSurfaceView ? `/herramientas/generated/abacus-ai/${defectId}/surface-view.jpg` : undefined,
        lastModified
      };
    }

    const totalDefects = defects.length;
    const generatedDefects = Object.values(status).filter(s => s.hasMain).length;
    const progress = (generatedDefects / totalDefects) * 100;

    return NextResponse.json({
      success: true,
      progress: {
        total: totalDefects,
        generated: generatedDefects,
        remaining: totalDefects - generatedDefects,
        percentage: Math.round(progress)
      },
      defects: status,
      estimatedTime: {
        perImage: '30-60 segundos',
        totalRemaining: `${(totalDefects - generatedDefects) * 45} segundos (aprox. ${Math.ceil((totalDefects - generatedDefects) * 45 / 60)} minutos)`
      }
    });

  } catch (error) {
    console.error('Error checking generation status:', error);
    return NextResponse.json(
      { 
        error: 'Error al verificar estado',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

