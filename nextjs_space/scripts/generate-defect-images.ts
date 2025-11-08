/**
 * Script para generar imágenes de defectos de soldadura usando Abacus.AI
 * 
 * Este script lee los prompts técnicos y genera imágenes para cada defecto
 * usando la API de Abacus.AI a través de la API route del proyecto.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DefectPrompt {
  id: string;
  name: string;
  category: string;
  severity: string;
  mainPrompt: string;
  crossSectionPrompt: string;
  surfaceViewPrompt: string;
}

interface PromptsData {
  version: string;
  createdDate: string;
  description: string;
  prompts: Record<string, DefectPrompt>;
}

// Cargar prompts técnicos
const promptsPath = path.join(process.cwd(), 'public', 'herramientas', 'generated', 'abacus-ai', 'prompts-tecnicos.json');
const promptsData: PromptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// URL de la API de generación de imágenes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const GENERATE_ENDPOINT = `${API_URL}/api/images/generate`;

/**
 * Genera una imagen usando la API de Abacus.AI
 */
async function generateImage(prompt: string, defectId: string, imageType: string): Promise<string | null> {
  try {
    console.log(`📤 Generando imagen: ${defectId} - ${imageType}...`);
    
    const response = await fetch(GENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: 'weldtech-brand',
        data: {
          defectId,
          imageType,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error generando ${defectId} - ${imageType}:`, errorData);
      return null;
    }

    const result = await response.json();
    
    if (!result.success || !result.imageUrl) {
      console.error(`❌ Error en respuesta para ${defectId} - ${imageType}:`, result);
      return null;
    }

    console.log(`✅ Imagen generada exitosamente: ${defectId} - ${imageType}`);
    return result.imageUrl;
  } catch (error) {
    console.error(`❌ Error al generar imagen ${defectId} - ${imageType}:`, error);
    return null;
  }
}

/**
 * Descarga una imagen desde una URL y la guarda localmente
 */
async function downloadImage(imageUrl: string, savePath: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`❌ Error descargando imagen: ${imageUrl}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(savePath, Buffer.from(buffer));
    console.log(`✅ Imagen guardada: ${savePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error guardando imagen ${savePath}:`, error);
    return false;
  }
}

/**
 * Genera todas las imágenes para un defecto
 */
async function generateDefectImages(defect: DefectPrompt): Promise<void> {
  const defectDir = path.join(
    process.cwd(),
    'public',
    'herramientas',
    'generated',
    'abacus-ai',
    defect.id
  );

  // Crear directorio si no existe
  if (!fs.existsSync(defectDir)) {
    fs.mkdirSync(defectDir, { recursive: true });
  }

  // Generar imagen principal
  const mainImageUrl = await generateImage(defect.mainPrompt, defect.id, 'main');
  if (mainImageUrl) {
    const mainPath = path.join(defectDir, 'main.jpg');
    await downloadImage(mainImageUrl, mainPath);
  }

  // Generar imagen de corte transversal
  const crossSectionUrl = await generateImage(defect.crossSectionPrompt, defect.id, 'cross-section');
  if (crossSectionUrl) {
    const crossSectionPath = path.join(defectDir, 'cross-section.jpg');
    await downloadImage(crossSectionUrl, crossSectionPath);
  }

  // Generar imagen de vista superficial
  const surfaceViewUrl = await generateImage(defect.surfaceViewPrompt, defect.id, 'surface-view');
  if (surfaceViewUrl) {
    const surfaceViewPath = path.join(defectDir, 'surface-view.jpg');
    await downloadImage(surfaceViewUrl, surfaceViewPath);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando generación de imágenes de defectos...\n');

  const defects = Object.values(promptsData.prompts);
  let successCount = 0;
  let errorCount = 0;

  for (const defect of defects) {
    console.log(`\n📋 Procesando defecto: ${defect.name} (${defect.id})`);
    try {
      await generateDefectImages(defect);
      successCount++;
    } catch (error) {
      console.error(`❌ Error procesando ${defect.id}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Exitosos: ${successCount}`);
  console.log(`   - Errores: ${errorCount}`);
  console.log(`   - Total: ${defects.length}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

export { generateDefectImages, generateImage, downloadImage };

