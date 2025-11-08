/**
 * Script para optimizar imágenes de defectos generadas
 * 
 * Este script procesa y optimiza las imágenes generadas con Abacus.AI
 * para su uso en producción.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ImageMetadata {
  filename: string;
  defectId: string;
  imageType: string;
  originalSize: number;
  optimizedSize?: number;
  dimensions?: { width: number; height: number };
  format: string;
  generatedAt: string;
}

/**
 * Optimiza una imagen (placeholder - requiere librería de procesamiento de imágenes)
 */
async function optimizeImage(imagePath: string): Promise<boolean> {
  // TODO: Implementar optimización real usando sharp o similar
  // Por ahora, solo verificamos que el archivo existe
  try {
    const stats = fs.statSync(imagePath);
    console.log(`✓ Imagen encontrada: ${imagePath} (${stats.size} bytes)`);
    return true;
  } catch (error) {
    console.error(`✗ Error con imagen ${imagePath}:`, error);
    return false;
  }
}

/**
 * Genera metadatos para una imagen
 */
function generateImageMetadata(
  imagePath: string,
  defectId: string,
  imageType: string
): ImageMetadata {
  const stats = fs.statSync(imagePath);
  const filename = path.basename(imagePath);
  
  return {
    filename,
    defectId,
    imageType,
    originalSize: stats.size,
    format: path.extname(imagePath).slice(1),
    generatedAt: stats.mtime.toISOString()
  };
}

/**
 * Procesa todas las imágenes de un defecto
 */
async function processDefectImages(defectId: string): Promise<ImageMetadata[]> {
  const defectDir = path.join(
    process.cwd(),
    'public',
    'herramientas',
    'generated',
    'abacus-ai',
    defectId
  );

  if (!fs.existsSync(defectDir)) {
    console.log(`⚠ Directorio no existe: ${defectDir}`);
    return [];
  }

  const images: ImageMetadata[] = [];
  const imageTypes = ['main', 'cross-section', 'surface-view'];

  for (const imageType of imageTypes) {
    const imagePath = path.join(defectDir, `${imageType}.jpg`);
    
    if (fs.existsSync(imagePath)) {
      // Optimizar imagen
      const optimized = await optimizeImage(imagePath);
      
      if (optimized) {
        const metadata = generateImageMetadata(imagePath, defectId, imageType);
        images.push(metadata);
      }
    }
  }

  return images;
}

/**
 * Genera archivo de metadatos para todas las imágenes
 */
async function generateMetadataFile(metadata: ImageMetadata[]): Promise<void> {
  const metadataPath = path.join(
    process.cwd(),
    'public',
    'herramientas',
    'generated',
    'abacus-ai',
    'images-metadata.json'
  );

  const metadataContent = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    totalImages: metadata.length,
    images: metadata
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadataContent, null, 2));
  console.log(`✓ Metadatos guardados en: ${metadataPath}`);
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando optimización de imágenes de defectos...\n');

  const defects = [
    'porosidad',
    'grietas',
    'undercut',
    'escoria',
    'salpicaduras',
    'sobreposicion'
  ];

  const allMetadata: ImageMetadata[] = [];

  for (const defectId of defects) {
    console.log(`\n📋 Procesando defecto: ${defectId}`);
    const metadata = await processDefectImages(defectId);
    allMetadata.push(...metadata);
    console.log(`   ✓ ${metadata.length} imágenes procesadas`);
  }

  // Generar archivo de metadatos
  await generateMetadataFile(allMetadata);

  console.log(`\n✅ Optimización completada:`);
  console.log(`   - Total de imágenes: ${allMetadata.length}`);
  console.log(`   - Defectos procesados: ${defects.length}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

export { optimizeImage, generateImageMetadata, processDefectImages };

