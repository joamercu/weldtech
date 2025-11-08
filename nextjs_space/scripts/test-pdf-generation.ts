/**
 * Script de prueba para verificar la generación de PDF de la Guía de Servicio
 * 
 * Ejecutar con: npx tsx scripts/test-pdf-generation.ts
 */

import { generateServiceGuidePDF } from '../lib/pdf/pdf-builder';
import { getGuiaIntegralMarkdownPath } from '../lib/pdf/markdown-processor';
import fs from 'fs';
import path from 'path';

async function testPDFGeneration() {
  console.log('🧪 Iniciando prueba de generación de PDF...\n');

  try {
    // 1. Verificar que el archivo markdown existe
    console.log('1️⃣ Verificando archivo markdown...');
    const markdownPath = getGuiaIntegralMarkdownPath();
    
    if (!fs.existsSync(markdownPath)) {
      throw new Error(`❌ No se encontró el archivo markdown en: ${markdownPath}`);
    }
    
    const markdownSize = fs.statSync(markdownPath).size;
    console.log(`✅ Archivo markdown encontrado: ${markdownPath}`);
    console.log(`   Tamaño: ${(markdownSize / 1024).toFixed(2)} KB\n`);

    // 2. Generar PDF
    console.log('2️⃣ Generando PDF...');
    const startTime = Date.now();
    
    const pdfBuffer = await generateServiceGuidePDF({
      userId: 'test-user-123',
      userName: 'Usuario de Prueba',
      userEmail: 'test@weldtechsolutions.com',
    });
    
    const generationTime = Date.now() - startTime;
    const pdfSize = pdfBuffer.length;
    
    console.log(`✅ PDF generado exitosamente`);
    console.log(`   Tiempo de generación: ${generationTime}ms (${(generationTime / 1000).toFixed(2)}s)`);
    console.log(`   Tamaño del PDF: ${(pdfSize / 1024).toFixed(2)} KB (${(pdfSize / 1024 / 1024).toFixed(2)} MB)\n`);

    // 3. Verificar que el PDF es válido
    console.log('3️⃣ Verificando validez del PDF...');
    
    // Un PDF válido debe comenzar con %PDF
    const pdfHeader = pdfBuffer.toString('utf-8', 0, 4);
    if (pdfHeader !== '%PDF') {
      throw new Error(`❌ El PDF generado no es válido. Header esperado: %PDF, obtenido: ${pdfHeader}`);
    }
    
    console.log(`✅ PDF válido (header: ${pdfHeader})\n`);

    // 4. Guardar PDF de prueba
    console.log('4️⃣ Guardando PDF de prueba...');
    const outputPath = path.join(process.cwd(), 'test-guia-servicio.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ PDF guardado en: ${outputPath}\n`);

    // 5. Verificar criterios de éxito
    console.log('5️⃣ Verificando criterios de éxito...\n');
    
    const criteria = {
      'Tiempo de generación < 5 segundos': generationTime < 5000,
      'Tamaño de archivo < 10 MB': pdfSize < 10 * 1024 * 1024,
      'PDF válido': pdfHeader === '%PDF',
    };
    
    let allPassed = true;
    for (const [criterion, passed] of Object.entries(criteria)) {
      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${criterion}`);
      if (!passed) allPassed = false;
    }
    
    console.log('\n' + '='.repeat(60));
    if (allPassed) {
      console.log('✅ TODAS LAS PRUEBAS PASARON');
      console.log('='.repeat(60));
      console.log('\n📄 El PDF de prueba está disponible en:');
      console.log(`   ${outputPath}`);
      console.log('\n💡 Puedes abrir el PDF para verificar visualmente:');
      console.log('   - Portada con información del usuario');
      console.log('   - Tabla de contenidos');
      console.log('   - Contenido del markdown');
      console.log('   - Metadata correcta');
    } else {
      console.log('❌ ALGUNAS PRUEBAS FALLARON');
      console.log('='.repeat(60));
    }
    
  } catch (error) {
    console.error('\n❌ Error durante la prueba:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Ejecutar prueba
testPDFGeneration();

